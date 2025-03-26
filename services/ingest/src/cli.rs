use std::{fs, path::PathBuf};

use anyhow::{Context, Result};
use clap::Parser;
use serde::{Deserialize, Serialize};

use crate::modules::{monitoring, opcua, uploader};

#[derive(Parser, Debug)]
#[command(author, version, about)]
pub struct Cli {
    #[arg(short, long, value_name = "FILE", default_value = "config.toml")]
    pub config: PathBuf,
}

#[derive(Serialize, Deserialize)]
pub struct Config {
    pub upload: Option<uploader::Config>,
    pub monitoring: Option<Vec<monitoring::SensorConfig>>,
    pub opcua: Option<opcua::Config>,
}

impl Config {
    pub fn parse_file(file: PathBuf) -> Result<Self> {
        let contents = fs::read_to_string(&file)
            .context(format!("Failed to read file: {}", &file.display()))?;
        let config = toml::from_str(&contents)?;

        Ok(config)
    }
}
