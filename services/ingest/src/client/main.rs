use anyhow::Result;
use reader::Reader;
use reading::{conditions_service_client::ConditionsServiceClient, ConditionsRequest, Reading};
use std::time::Duration;
use tokio::{
    signal,
    sync::{mpsc, oneshot},
    time::interval,
};
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
    let (sender, mut receiver) = mpsc::channel::<Reading>(100);
    let (shutdown_send, mut shutdown_recv) = oneshot::channel();

    tokio::spawn(async move {
        signal::ctrl_c().await.expect("Failed to listen for Ctrl+C");
        shutdown_send
            .send(())
            .expect("Failed to send shutdown signal");
    });

    let mut interval = interval(LOOP_DURATION);
    let mut batch = Vec::with_capacity(BATCH_SIZE);

    loop {
        tokio::select! {
            _ = interval.tick() => {
                if let Err(e) = pc_reader.read(&sender).await {
                    eprintln!("Failed to collect and send readings: {}", e);
                }
            }

            Some(reading) = receiver.recv() => {
                batch.push(reading.clone());
                println!("{:?}", reading) ;

                if batch.len() >= BATCH_SIZE {
                    send_readings(&mut client, &mut batch).await;
                }
            }

            _ = &mut shutdown_recv => {

                if !batch.is_empty() {
                    send_readings(&mut client, &mut batch).await;
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
) {
    let request = tonic::Request::new(ConditionsRequest {
        readings: readings.to_vec(),
    });
    match client.send_conditions(request).await {
        Ok(_) => {
            println!("Sending final readings was a success!");
            readings.clear();
        }
        Err(e) => eprintln!("Failed to send final readings: {}", e),
    }
}
