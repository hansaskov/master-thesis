use std::sync::Mutex;
use std::time::Duration;

use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use tokio::time;
use wmi::{COMLibrary, WMIConnection};

use crate::module::{Module, ModuleCtx};
use crate::reading::Reading;

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "PascalCase")]
pub enum SensorType {
    Temperature,
    Load,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SensorConfig {
    pub category: String,
    pub name: String,
    pub unit: String,
    pub sensor_type: SensorType,
    pub query_name: String,
}

pub struct Monitoring {
    ctx: ModuleCtx,
    wmi_con: Mutex<WMIConnection>,
    sensors: Vec<SensorConfig>,
}

#[derive(Deserialize)]
struct WmiSensor {
    value: f32,
}

impl Monitoring {
    pub fn new(ctx: ModuleCtx, sensors_config: Vec<SensorConfig>) -> Self {
        let com_con = COMLibrary::new()
            .context("Failed to initialize COM library")
            .expect("COM library initialization");

        let wmi_con = WMIConnection::with_namespace_path("ROOT\\LibreHardwareMonitor", com_con)
            .context("Failed to connect to WMI namespace")
            .expect("WMI connection");

        Self {
            ctx,
            wmi_con: Mutex::new(wmi_con), // Wrap in Mutex
            sensors: sensors_config,
        }
    }

    fn build_query(config: &SensorConfig) -> String {
        format!(
            "SELECT * FROM Sensor WHERE SensorType = '{:?}' AND Name LIKE '%{}%'",
            config.sensor_type, config.query_name
        )
    }

    fn fetch_reading(&self, config: &SensorConfig) -> Result<Reading> {
        let query = Self::build_query(config);
        // Lock the WMIConnection to use it
        let wmi_con = self
            .wmi_con
            .lock()
            .map_err(|_| anyhow::anyhow!("Failed to acquire WMI connection lock"))?;

        let sensors: Vec<WmiSensor> = wmi_con
            .raw_query(&query)
            .context("Failed to query sensor data")?;

        let value = sensors
            .first()
            .context(format!(
                "No data found for {}. \t Is LibreHardwareMonitor Running?",
                config.query_name
            ))?
            .value;

        Ok(Reading {
            time: std::time::SystemTime::now(),
            category: config.category.to_string(),
            name: config.name.to_string(),
            unit: config.unit.to_string(),
            value,
        })
    }
}

impl Module for Monitoring {
    async fn run(&mut self) -> Result<()> {
        let mut interval = time::interval(Duration::from_secs(1));

        loop {
            tokio::select! {
                _ = interval.tick() => {
                    for sensor in &self.sensors {
                        match self.fetch_reading(sensor) {
                            Ok(reading) => self.ctx.send_reading(reading),
                            Err(e) => self.ctx.send_log(format!("{e}")),
                        }
                    }
                }
            }
        }
    }
}
