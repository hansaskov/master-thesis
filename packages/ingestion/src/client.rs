use anyhow::{Context, Result};
use std::time::{Duration, SystemTime};
use temperature::{conditions_service_client::ConditionsServiceClient, ConditionsRequest, Reading};
use tokio::{signal, sync::mpsc, time::interval};
pub mod temperature {
    tonic::include_proto!("temperature");
}
mod windows_hardware_monitor;
use windows_hardware_monitor::windows_hardware_monitor::HardwareMonitor;

const BATCH_SIZE: usize = 5;
const LOOP_DURATION: Duration = Duration::from_secs(1);

#[tokio::main]
async fn main() -> Result<()> {
    let mut client = ConditionsServiceClient::connect("http://[::1]:50051").await?;
    let hw = HardwareMonitor::new().context("Failed to initialize hardware monitor")?;
    let mut readings = Vec::with_capacity(BATCH_SIZE);

    let (shutdown_send, mut shutdown_recv) = mpsc::channel(1);
    tokio::spawn(async move {
        signal::ctrl_c().await.expect("Failed to listen for Ctrl+C");
        shutdown_send
            .send(())
            .await
            .expect("Failed to send shutdown signal");
    });

    let mut interval = interval(LOOP_DURATION);
    loop {
        tokio::select! {
            _ = interval.tick() => {

                match record_temperature(&hw) {
                    Ok(reading) => {
                        println!("{:?}, {:?}", reading.timestamp, reading.condition);
                        readings.push(reading);
                        if readings.len() >= BATCH_SIZE {
                            // Handle potential error from await
                            match send_readings(&mut client, &mut readings).await {
                                Ok(_) =>  println!("Request was a success!"),
                                Err(e) => eprintln!("Failed to send readings: {}", e),
                            }
                        }
                    },
                    Err(e) => eprintln!("Failed to record temperature: {}", e),
                }


            }
            _ = shutdown_recv.recv() => {
                if !readings.is_empty() {
                    match send_readings(&mut client, &mut readings).await {
                        Ok(_) =>  println!("Sending final readings was a success!"),
                        Err(e) => eprintln!("Failed to send final readings: {}", e),
                    };
                }
                println!("Shutting down gracefully.");
                break;
            }
        }
    }
    Ok(())
}

fn record_temperature(hw: &HardwareMonitor) -> Result<Reading> {
    let timestamp = prost_types::Timestamp::from(SystemTime::now());
    let conditions = hw
        .get_conditions()
        .context("No values read, are you sure LibreHardwareMonitor is running?")?;
    Ok(Reading {
        timestamp: Some(timestamp),
        condition: Some(conditions),
    })
}

async fn send_readings(
    client: &mut ConditionsServiceClient<tonic::transport::Channel>,
    readings: &mut Vec<Reading>,
) -> Result<()> {
    let request = tonic::Request::new(ConditionsRequest {
        readings: readings.to_vec(),
    });

    match client.send_conditions(request).await {
        Ok(r) => {
            readings.clear();
            Ok(())
        }
        Err(e) => Err(e).context("Failed to send temperatures"),
    }
}
