#[cfg(target_os = "windows")]
pub mod pc_reader {
    use crate::reading;
    use crate::Reader;
    use anyhow::{anyhow, Result};
    use reading::Reading;
    use serde::Deserialize;
    use std::time::SystemTime;
    use tokio::sync::mpsc::Sender;
    use wmi::{COMLibrary, WMIConnection};

    pub struct PCReader {
        wmi_con: WMIConnection,
    }

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
    struct Sensor {
        // sensor_type: SensorType,
        //  name: String,
        value: f32,
        //  min: f32,
        //  max: f32,
    }

    struct ReadingDefinition {
        name: &'static str,
        sensor_type: SensorType,
        query_name: &'static str,
        exact_match: bool,
        unit: &'static str,
        category: Option<&'static str>,
    }

    // This is the single place to add new readings
    const READING_DEFINITIONS: &[ReadingDefinition] = &[
        ReadingDefinition {
            name: "CPU Temperature",
            sensor_type: SensorType::Temperature,
            query_name: "Core",
            exact_match: false,
            unit: "C",
            category: Some("computer"),
        },
        ReadingDefinition {
            name: "CPU Usage",
            sensor_type: SensorType::Load,
            query_name: "CPU Total",
            exact_match: true,
            unit: "%",
            category: Some("computer"),
        },
        ReadingDefinition {
            name: "Memory Usage",
            sensor_type: SensorType::Load,
            query_name: "Memory",
            exact_match: true,
            unit: "%",
            category: Some("computer"),
        },
        // Add more readings here as needed
    ];

    impl PCReader {
        pub fn new() -> Result<Self> {
            let com_con = COMLibrary::new()?;
            let wmi_con =
                WMIConnection::with_namespace_path("ROOT\\LibreHardwareMonitor", com_con)?;
            Ok(Self { wmi_con })
        }

        fn get_query(sensor_type: &SensorType, name_filter: &str, exact_match: bool) -> String {
            let comparison = if exact_match { "=" } else { "LIKE" };
            let value = if exact_match {
                name_filter.to_string()
            } else {
                format!("%{}%", name_filter)
            };
            format!(
                "SELECT * FROM Sensor WHERE SensorType = '{:?}' AND Name {comparison} '{value}'",
                sensor_type
            )
        }

        fn get_sensor(&self, query: &str) -> Result<Sensor> {
            let result: Vec<Sensor> = self.wmi_con.raw_query(query)?;
            result
                .first()
                .cloned()
                .ok_or_else(|| anyhow!("Sensor not found. Is Libre Hardware Monitor running?"))
        }

        fn get_reading(&self, definition: &ReadingDefinition) -> Result<Reading> {
            let query = Self::get_query(
                &definition.sensor_type,
                definition.query_name,
                definition.exact_match,
            );
            let sensor = self.get_sensor(&query)?;
            let timestamp = SystemTime::now();

            Ok(Reading {
                time: timestamp,
                name: definition.name.to_string(),
                value: sensor.value,
                unit: definition.unit.to_string(),
                category: definition.category.map(str::to_string),
            })
        }

        pub fn get_all_readings(&self) -> Result<Vec<Reading>> {
            READING_DEFINITIONS
                .iter()
                .map(|def| self.get_reading(def))
                .collect()
        }
    }

    impl Reader for PCReader {
        async fn read(&mut self, sender: &Sender<Reading>) -> anyhow::Result<()> {
            let readings = self.get_all_readings()?;
            for reading in readings {
                sender.send(reading).await?;
            }
            Ok(())
        }
    }
}
