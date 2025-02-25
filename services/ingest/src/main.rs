use anyhow::{Context, Result};
use clap::Parser;
use reader::Reader;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

use std::time::{Duration};
use tokio::{
    signal,
    sync::{mpsc, oneshot},
    time::{interval, sleep},
};

mod local_queue;
mod reader;
use local_queue::{LocalQueue, SqliteQueue};
mod hardware_monitor_reader;
use hardware_monitor_reader::pc_reader;
mod reading;
use reading::Reading;
mod config;
use config::{Args, Mode};

const BATCH_SIZE: usize = 10;
const LOOP_DURATION: Duration = Duration::from_secs(1);

#[derive(Debug, Serialize, Deserialize)]
struct APIReading {
    time: String,
    name: String,
    value: f32,
    unit: String,
}

impl From<Reading> for APIReading {
    fn from(reading: Reading) -> Self {
        let timestamp = reading.timestamp;
        
        // Convert to DateTime<Utc> for easier formatting
        let datetime = DateTime::<Utc>::from(timestamp);
        
        // Format according to ISO 8601 with milliseconds
        let date_str = datetime.format("%Y-%m-%dT%H:%M:%S.%3fZ").to_string();
    
        Self {
            time: date_str,
            name: reading.name,
            value: reading.value,
            unit: reading.unit,
        }
    }
}

struct APIClient {
    client: Client,
    endpoint: String,
    private_key: String,
}

impl APIClient {
    fn new(endpoint: String, private_key: String) -> Self {
        let client = Client::builder()
            .timeout(Duration::from_secs(30))
            .build()
            .expect("Failed to create HTTP client");

        Self {
            client,
            endpoint,
            private_key,
        }
    }

    async fn send_readings(&self, readings: Vec<Reading>) -> Result<()> {
        let api_readings: Vec<APIReading> = readings.into_iter()
            .map(APIReading::from)
            .collect();

        let response = self.client
            .post(&self.endpoint)
            .header("private_key", &self.private_key)
            .json(&api_readings)
            .send()
            .await
            .context("Failed to send readings to API")?;

        if !response.status().is_success() {
            let error_text = response.text().await
                .context("Failed to get error response text")?;
            anyhow::bail!("API request failed: {}", error_text);
        }

        Ok(())
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();
    println!("Running in {:?} mode", args.mode);

    // Initialize API client
    let api_client = APIClient::new(
        args.api_endpoint.clone(),
        args.private_key.clone(),
    );

    let mut pc_reader = pc_reader::PCReader::new()?;
    let local_queue = SqliteQueue::new(&args.database_url).await?;
    let (sender, mut receiver) = mpsc::channel::<Reading>(100);
    let (shutdown_send, mut shutdown_recv) = oneshot::channel();
    let mut interval = interval(LOOP_DURATION);

    tokio::spawn(async move {
        signal::ctrl_c().await.expect("Failed to listen for Ctrl+C");
        shutdown_send
            .send(())
            .expect("Failed to send shutdown signal");
    });

    match args.mode {
        Mode::Send => {
            while let Ok(length) = local_queue.len().await {
                if length == 0 {
                    println!("No files to send, closing");
                    break;
                }
                sleep(Duration::from_millis(100)).await;
                let _ = send_readings(&api_client, &local_queue, BATCH_SIZE).await
                    .map_err(|e| eprintln!("Failed to send readings: {}", e));
            }
        },
        _ => {
            loop {
                tokio::select! {
                    _ = interval.tick() => {
                        if let Err(e) = pc_reader.read(&sender).await {
                            eprintln!("Failed to collect and send readings: {}", e);
                        }
                    }
            
                    Some(reading) = receiver.recv() => {
                        let _ = local_queue.push(reading.clone()).await
                            .map_err(|e| eprintln!("Failed to push to queue: {:?}", e));
        
                        match local_queue.len().await {
                            Ok(length) if args.mode == Mode::Full && length >= BATCH_SIZE => {
                                let _ = send_readings(&api_client, &local_queue, BATCH_SIZE).await
                                    .map_err(|e| eprintln!("Failed to send readings: {}", e));                      
                            } 
                            Ok(length) => println!("Added reading to queue: {reading:?}. Size {length:?}"),
                            Err(e) => eprintln!("Failed to get queue length: {:?}", e)
                        }
                    }
        
                    _ = &mut shutdown_recv => {
                        println!("Shutting down gracefully.");
                        break;
                    }
                }
            }
        }
    }
    
    Ok(())
}

async fn send_readings(
    api_client: &APIClient,
    queue: &SqliteQueue,
    length: usize,
) -> Result<()> {
    let readings = queue.peek(length).await?;
    
    api_client.send_readings(readings).await?;
    println!("Successfully sent values");

    queue.pop(length).await?;
    println!("Popped values from queue");

    Ok(())
}