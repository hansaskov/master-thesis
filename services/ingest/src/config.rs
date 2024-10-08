use clap::Parser;
use std::net::SocketAddr;

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
pub struct Args {
    #[arg(short, long = "db-url", env)]
    pub database_url: String,

    #[arg(short, long = "address", env, default_value = "[::0]:50051")]
    pub server_address: SocketAddr,

    #[arg(short, long, env, default_value = "5")]
    pub max_connections: u32,
}
