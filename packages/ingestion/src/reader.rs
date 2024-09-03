#[cfg(target_os = "windows")]
pub mod pc_reader {
    use crate::reading;
    use anyhow::{anyhow, Result};
    use reading::Reading;
    use serde::Deserialize;
    use std::time::{SystemTime};
    use tokio::sync::mpsc::Sender;
    use wmi::{COMLibrary, WMIConnection};

    const ERROR_MSG: &str = "Found nothing, are you sure Libre Hardware Monitor is running?";

    #[derive(Deserialize, Debug, Clone)]
    #[serde(rename_all = "PascalCase")]
    pub enum SensorType {
        Voltage,
        Clock,
        Temperature,
        Load,
        Fan,
        Flow,
        Control,
        Level,
    }

    #[derive(Deserialize, Debug, Clone)]
    #[serde(rename_all = "PascalCase")]
    pub struct Sensor {
        pub sensor_type: SensorType,
        pub name: String,
        pub value: f32,
        pub min: f32,
        pub max: f32,
    }

    pub struct PCReader {
        pub wmi_con: WMIConnection,
        sender: Sender<Reading>,
    }

    impl PCReader {
        pub fn new(sender: Sender<Reading>) -> Result<Self> {
            let com_con = COMLibrary::new()?;
            let wmi_con =
                WMIConnection::with_namespace_path("ROOT\\LibreHardwareMonitor", com_con)?;
            Ok(Self { wmi_con, sender })
        }

        fn get_like_query(sensor_type: SensorType, name_filter: &str) -> String {
            format!("SELECT * FROM Sensor WHERE SensorType = '{sensor_type:?}' AND Name LIKE '%{name_filter}%'")
        }

        fn get_equals_query(sensor_type: SensorType, name_filter: &str) -> String {
            format!("SELECT * FROM Sensor WHERE SensorType = '{sensor_type:?}' AND Name = '{name_filter}'")
        }

        fn get_sensor(&self, query: String) -> Result<Sensor> {
            let result: Vec<Sensor> = self.wmi_con.raw_query(query)?;
            result.first().cloned().ok_or_else(|| anyhow!(ERROR_MSG))
        }

        pub fn get_cpu_temperature(&self) -> Result<Reading> {
            let query = Self::get_like_query(SensorType::Temperature, "Core");
            let sensor = self.get_sensor(query)?;
            let timestamp = prost_types::Timestamp::from(SystemTime::now());
            Ok(Reading {
                timestamp: Some(timestamp),
                name: sensor.name,
                value: sensor.value,
                unit: "C".into(),
            })
        }

        pub fn get_cpu_usage(&self) -> Result<Reading> {
            let query = Self::get_equals_query(SensorType::Load, "CPU Total");
            let sensor = self.get_sensor(query)?;
            let timestamp = prost_types::Timestamp::from(SystemTime::now());
            Ok(Reading {
                timestamp: Some(timestamp),
                name: sensor.name,
                value: sensor.value,
                unit: "%".into(),
            })
        }

        pub fn get_memory_usage(&self) -> Result<Reading> {
            let query = Self::get_equals_query(SensorType::Load, "Memory");
            let sensor = self.get_sensor(query)?;
            let timestamp = prost_types::Timestamp::from(SystemTime::now());
            Ok(Reading {
                timestamp: Some(timestamp),
                name: sensor.name,
                value: sensor.value,
                unit: "%".into(),
            })
        }

        pub async fn collect_and_send_readings(&self) -> Result<()> {
            let cpu_temp = self.get_cpu_temperature()?;
            let cpu_usage = self.get_cpu_usage()?;
            let memory_usage = self.get_memory_usage()?;

            self.sender.send(cpu_temp).await?;
            self.sender.send(cpu_usage).await?;
            self.sender.send(memory_usage).await?;

            Ok(())
        }
    }
}
