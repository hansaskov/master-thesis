use std::time::{Duration, SystemTime};
use anyhow::Result;
use tokio::time;
use crate::{module::{Module, ModuleCtx}, reading::Reading};
use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub todo: Option<String>,
}

// Docker stats structure from JSON output
#[derive(Debug, Serialize, Deserialize)]
pub struct DockerStats {
    #[serde(rename = "BlockIO")]
    pub block_io: String,
    #[serde(rename = "CPUPerc")]
    pub cpu_perc: String,
    #[serde(rename = "MemPerc")]
    pub mem_perc: String,
    #[serde(rename = "MemUsage")]
    pub mem_usage: String,
    #[serde(rename = "Name")]
    pub name: String,
    #[serde(rename = "NetIO")]
    pub net_io: String,
}

// Get container stats by running docker command
fn list_containers_stats() -> Result<Vec<DockerStats>> {
    let output = Command::new("docker")
        .args(["stats", "--format", "json", "--no-stream"])
        .output()?;
    
    if !output.status.success() {
        anyhow::bail!("Docker error: {}", String::from_utf8_lossy(&output.stderr));
    }
    
    // Parse each line as separate JSON object
    let stats = output.stdout
        .split(|&c| c == b'\n')
        .filter(|line| !line.is_empty())
        .map(|line| serde_json::from_slice::<DockerStats>(line))
        .collect::<Result<Vec<_>, _>>()?;
    
    Ok(stats)
}

pub struct Docker {
    ctx: ModuleCtx,
}

impl Docker {
    pub fn new(ctx: ModuleCtx) -> Self {
        Self { ctx }
    }
    
    // Convert percentage string to float
    fn parse_percentage(&self, value: &str) -> Result<f32, std::num::ParseFloatError> {
        value.trim_end_matches('%').trim().parse::<f32>()
    }
    
    // Create CPU reading from stats
    fn parse_cpu_to_reading(&self, stat: &DockerStats, time: SystemTime) -> Result<Reading> {
        let cpu_value = self.parse_percentage(&stat.cpu_perc)?;
        Ok(Reading {
            category: "Docker".into(),
            name: format!("CPU {}", stat.name),
            unit: "%".into(),
            time,
            value: cpu_value
        })
    }
    
    // Create memory reading from stats
    fn parse_memory_to_reading(&self, stat: &DockerStats, time: SystemTime) -> Result<Reading> {
        let mem_value = self.parse_percentage(&stat.mem_perc)?;
        Ok(Reading {
            category: "Docker".into(),
            name: format!("Memory {}", stat.name),
            unit: "%".into(),
            time,
            value: mem_value
        })
    }
}

impl Module for Docker {
    async fn run(&mut self) -> Result<()> {
        let mut interval = time::interval(Duration::from_secs(1));
        
        loop {
            interval.tick().await;  // Simplified from tokio::select with single branch
            
            let time = SystemTime::now();
            if let Ok(stats) = list_containers_stats() {
                for stat in &stats {
                    // Send CPU reading
                    if let Ok(reading) = self.parse_cpu_to_reading(stat, time) {
                        self.ctx.send_reading(reading);
                    }
                    
                    // Send memory reading
                    if let Ok(reading) = self.parse_memory_to_reading(stat, time) {
                        self.ctx.send_reading(reading);
                    }
                }
            }
        }
    }
}