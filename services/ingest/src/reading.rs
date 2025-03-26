use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::time::SystemTime;

#[derive(Clone, Debug, Deserialize)]
pub struct Reading {
    pub time: SystemTime,
    pub name: String,
    pub value: f32,
    pub unit: String,
    pub category: String,
}

#[derive(Serialize)]
struct SerializableReading<'a> {
    time: String,
    name: &'a str,
    value: f32,
    unit: &'a str,
    category: &'a str,
}

impl Serialize for Reading {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let datetime = DateTime::<Utc>::from(self.time);
        let iso_time = datetime.format("%Y-%m-%dT%H:%M:%S.%3fZ").to_string();

        SerializableReading {
            time: iso_time,
            name: &self.name,
            value: self.value,
            unit: &self.unit,
            category: &self.category,
        }
        .serialize(serializer)
    }
}
