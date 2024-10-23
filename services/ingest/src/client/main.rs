use anyhow::{ Result};
use reader::Reader;
use reading::{conditions_service_client::ConditionsServiceClient, ConditionsRequest, Reading};
use std::time::Duration;
use tokio::{
    signal,
    sync::{mpsc, oneshot},
    time::interval,
};
use std::result::Result::Ok;
pub mod reading {
    tonic::include_proto!("reading");
}
mod local_queue;
mod reader;
use local_queue::{LocalQueue, SqliteQueue};
mod hardware_monitor_reader;
use hardware_monitor_reader::pc_reader;

const BATCH_SIZE: usize = 10;
const LOOP_DURATION: Duration = Duration::from_secs(1);

#[tokio::main]
async fn main() -> Result<()> {
    let mut client = ConditionsServiceClient::connect("http://[::1]:50051").await?;
    let mut pc_reader = pc_reader::PCReader::new()?;
    let local_queue = SqliteQueue::new("sqlite:local_readings.db").await?;
    let (sender, mut receiver) = mpsc::channel::<Reading>(100);
    let (shutdown_send, mut shutdown_recv) = oneshot::channel();
    let mut interval = interval(LOOP_DURATION);

    tokio::spawn(async move {
        signal::ctrl_c().await.expect("Failed to listen for Ctrl+C");
        shutdown_send
            .send(())
            .expect("Failed to send shutdown signal");
    });


    loop {
        tokio::select! {
            _ = interval.tick() => {
                if let Err(e) = pc_reader.read(&sender).await {
                    eprintln!("Failed to collect and send readings: {}", e);
                }
            }

            Some(reading) = receiver.recv() => {
                let _ = local_queue.push(reading.clone()).await.map_err(|e| eprintln!("{e:?}"));

                match local_queue.len().await {
                    Ok(length) if length >= BATCH_SIZE => {
                        let _ = send_readings(&mut client, &local_queue, BATCH_SIZE).await.map_err(|e| eprintln!("{e:?}"));                      
                    }
                    Ok(length) => println!("Added reading to queue: {reading:?}. Size {length:?}"),
                    Err(e) => eprint!("{e:?}")
                }
            }

            _ = &mut shutdown_recv => {

                println!("Shutting down gracefully.");
                break;
            }
        }
    }
    Ok(())
}

async fn send_readings(
    client: &mut ConditionsServiceClient<tonic::transport::Channel>,
    queue: &SqliteQueue,
    length: usize
) -> Result<()> {
    let readings = queue.peek(length).await?;

    let request = tonic::Request::new(ConditionsRequest {
        readings: readings.to_vec(),
    });

    client.send_conditions(request).await?;
    println!("Successfully sent values");

    queue.pop(length).await?;
    println!("Popped values from queue");

    Ok(())
}
