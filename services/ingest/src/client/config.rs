use clap::Parser;
use std::str::FromStr;

#[derive(Parser, Debug, Clone)]
#[command(author, version, about, long_about = None)]
pub struct Args {
    #[arg(short = 'm', long, env, help = "Specifies the operation mode: full, read, or send", default_value = "full")]
    pub mode: Mode,

    #[arg(short, long = "db-url", env, default_value = "sqlite:local_readings.db")]
    pub database_url: String,
}

#[derive(Debug, Clone, PartialEq)]
pub enum Mode {
    Full,
    Read,
    Send,
}

impl FromStr for Mode {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "full" => Ok(Mode::Full),
            "read" => Ok(Mode::Read),
            "send" => Ok(Mode::Send),
            _ => Err(format!("Invalid mode: {}", s)),
        }
    }
}