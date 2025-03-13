use anyhow::Result;
use clap::Parser;
use reader::Reader;

use std::time::Duration;
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
mod api;
use api::{APIClient, ApiClientInterface};
const BATCH_SIZE: usize = 10;
const LOOP_DURATION: Duration = Duration::from_secs(1);

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();
    println!("Running in {:?} mode", args.mode);

    // Initialize API client
    let api_client = APIClient::new(args.url, args.key);

    let mut pc_reader = pc_reader::PCReader::new()?;
    let local_queue = SqliteQueue::new(&args.sqlite).await?;
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
                let _ = send_readings(&api_client, &local_queue, BATCH_SIZE)
                    .await
                    .map_err(|e| eprintln!("Failed to send readings: {}", e));
            }
        }
        _ => loop {
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
        },
    }

    Ok(())
}

async fn send_readings(api_client: &APIClient, queue: &SqliteQueue, length: usize) -> Result<()> {
    let readings = queue.peek(length).await?;

    api_client.send(readings).await?;
    println!("Successfully sent values");

    queue.pop(length).await?;
    println!("Popped values from queue");

    Ok(())
}
