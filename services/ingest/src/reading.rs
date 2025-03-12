use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::time::SystemTime;

// Define a trait to extend SystemTime
pub trait ISO8601Formatter {
    fn to_iso8601(&self) -> String;
}

// Implement the trait for SystemTime
impl ISO8601Formatter for SystemTime {
    fn to_iso8601(&self) -> String {
        let datetime = DateTime::<Utc>::from(*self);
        datetime.format("%Y-%m-%dT%H:%M:%S.%3fZ").to_string()
    }
}

#[derive(Clone, Debug, Deserialize)]
pub struct Reading {
    pub time: SystemTime,
    pub name: String,
    pub value: f32,
    pub unit: String,
    pub category: Option<String>,
}

impl Serialize for Reading {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::SerializeStruct;
        let mut state = serializer.serialize_struct("Reading", 5)?;
        state.serialize_field("time", &self.time.to_iso8601())?;
        state.serialize_field("name", &self.name)?;
        state.serialize_field("value", &self.value)?;
        state.serialize_field("unit", &self.unit)?;
        state.serialize_field("category", &self.category)?;
        state.end()
    }
}
