#[cfg(target_os = "windows")]
pub mod windows_hardware_monitor {
    use crate::temperature;
    use anyhow::{anyhow, Result};
    use serde::Deserialize;
    use temperature::Conditions;
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

    pub struct HardwareMonitor {
        pub wmi_con: WMIConnection,
    }

    impl HardwareMonitor {
        pub fn new() -> Result<Self> {
            let com_con = COMLibrary::new()?;
            let wmi_con =
                WMIConnection::with_namespace_path("ROOT\\LibreHardwareMonitor", com_con)?;
            Ok(Self { wmi_con })
        }

        fn get_like_query(sensor_type: SensorType, name_filter: &str) -> String {
            format!("SELECT * FROM Sensor WHERE SensorType = '{sensor_type:?}' AND Name LIKE '%{name_filter}%'")
        }

        fn get_equals_query(sensor_type: SensorType, name_filter: &str) -> String {
            format!("SELECT * FROM Sensor WHERE SensorType = '{sensor_type:?}' AND Name = '{name_filter}'")
        }

        fn get_sensor(
            &self,
            sensor_type: SensorType,
            name_filter: &str,
            use_like: bool,
        ) -> Result<Sensor> {
            let query = if use_like {
                Self::get_like_query(sensor_type, name_filter)
            } else {
                Self::get_equals_query(sensor_type, name_filter)
            };
            let result: Vec<Sensor> = self.wmi_con.raw_query(query)?;
            result.first().cloned().ok_or_else(|| anyhow!(ERROR_MSG))
        }

        pub fn cpu_temperature(&self) -> Result<Sensor> {
            self.get_sensor(SensorType::Temperature, "Core", true)
        }

        pub fn cpu_usage(&self) -> Result<Sensor> {
            self.get_sensor(SensorType::Load, "CPU Total", true)
        }

        pub fn memory_usage(&self) -> Result<Sensor> {
            self.get_sensor(SensorType::Load, "Memory", false)
        }

        pub fn get_conditions(&self) -> Result<Conditions> {
            Ok(Conditions {
                cpu_temperature: self.cpu_temperature()?.value,
                cpu_usage: self.cpu_usage()?.value,
                memory_usage: self.memory_usage()?.value,
            })
        }
    }
}
