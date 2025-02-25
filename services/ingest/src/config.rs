use clap::Parser;
use std::str::FromStr;

#[derive(Parser, Debug, Clone)]
#[command(author, version, about, long_about = None)]
pub struct Args {
    #[arg(short = 'm', long, env, help = "Specifies the operation mode: full, read, or send", default_value = "full")]
    pub mode: Mode,

    #[arg(short, long = "db-url", env, default_value = "sqlite:local_readings.db")]
    pub database_url: String,

    #[clap(long, env = "API_ENDPOINT")]
    pub api_endpoint: String,
    
    #[clap(long, env = "PRIVATE_KEY")]
    pub private_key: String,
}

#[derive(clap::ValueEnum, Debug, Clone, PartialEq)]
pub enum Mode {
    Full,
    Read,
    Send,
}
