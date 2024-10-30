use std::time::SystemTime;

#[derive(Clone, Debug)]
pub struct Reading {
    pub timestamp: SystemTime,
    pub name: String,
    pub value: f32,
    pub unit: String,
}