use anyhow::{Context, Result};
use reading::{conditions_service_client::ConditionsServiceClient, ConditionsRequest, Reading};
use std::time::Duration;
use tokio::{signal, sync::mpsc, time::interval};
pub mod reading {
    tonic::include_proto!("reading");
}
mod reader;
use reader::pc_reader::PCReader;

const BATCH_SIZE: usize = 10;
const LOOP_DURATION: Duration = Duration::from_secs(1);

#[tokio::main]
async fn main() -> Result<()> {
    let mut client = ConditionsServiceClient::connect("http://[::1]:50051").await?;
    let (sender, mut receiver) = mpsc::channel::<Reading>(100);
    let pc_reader = PCReader::new(sender.clone())?;
    let (shutdown_send, mut shutdown_recv) = mpsc::channel(1);

    tokio::spawn(async move {
        signal::ctrl_c().await.expect("Failed to listen for Ctrl+C");
        shutdown_send
            .send(())
            .await
            .expect("Failed to send shutdown signal");
    });

    let mut interval = interval(LOOP_DURATION);
    let mut batch = Vec::with_capacity(BATCH_SIZE);

    loop {
        tokio::select! {
            _ = interval.tick() => {
                if let Err(e) = pc_reader.collect_and_send_readings().await {
                    eprintln!("Failed to collect and send readings: {}", e);
                }
            }

            Some(reading) = receiver.recv() => {
                batch.push(reading.clone());
                println!("{:?}", reading) ;

                if batch.len() >= BATCH_SIZE {
                    match send_readings(&mut client, &mut batch).await {
                        Ok(_) => println!("Request was a success!"),
                        Err(e) => eprintln!("Failed to send readings: {}", e),
                    }
                    batch.clear();
                }
            }
            _ = shutdown_recv.recv() => {
                // Drain any remaining readings from the channel
                while let Ok(reading) = receiver.try_recv() {
                    batch.push(reading);
                }

                if !batch.is_empty() {
                    match send_readings(&mut client, &mut batch).await {
                        Ok(_) => println!("Sending final readings was a success!"),
                        Err(e) => eprintln!("Failed to send final readings: {}", e),
                    }
                }
                println!("Shutting down gracefully.");
                break;
            }
        }
    }
    Ok(())
}

async fn send_readings(
    client: &mut ConditionsServiceClient<tonic::transport::Channel>,
    readings: &mut Vec<Reading>,
) -> Result<()> {
    let request = tonic::Request::new(ConditionsRequest {
        readings: readings.to_vec(),
    });
    match client.send_conditions(request).await {
        Ok(_) => {
            readings.clear();
            Ok(())
        }
        Err(e) => Err(e).context("Failed to send temperatures"),
    }
}
