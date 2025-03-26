pub mod cli;
pub mod event_bus;
pub mod module;
pub mod modules;
pub mod reading;

use anyhow::Result;
use clap::Parser;
use cli::{Cli, Config};
use event_bus::EventBus;
use module::{Module, ModuleCtx};
use modules::logger::Logger;
use modules::monitoring::Monitoring;
use modules::opcua::OPCUA;
use modules::uploader::Uploader;
use std::thread;
use tokio::task::JoinSet;

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();
    let config = Config::parse_file(cli.config)?;

    let event_bus = EventBus::new();
    let opcua_ctx = ModuleCtx::new("opcua", &event_bus);
    let logger_ctx = ModuleCtx::new("logger", &event_bus);
    let uploader_ctx = ModuleCtx::new("uploader", &event_bus);
    let monitoring_ctx = ModuleCtx::new("monitoring", &event_bus);

    // Used to store async tasks.
    let mut set = JoinSet::new();

    // OPCUA
    match config.opcua {
        Some(opcua_config) => {
            set.spawn(async move { OPCUA::new(opcua_ctx, opcua_config).run().await });
        }
        None => println!("Warn: Skipping OPCUA"),
    }

    // Logger
    set.spawn(async move { Logger::new(logger_ctx).run().await });

    // Uploader
    if let Some(arguments) = config.upload {
        set.spawn(async move { Uploader::new(uploader_ctx, arguments).run().await });
    }

    // Monitoring
    // Create a dedicated thread for monitoring (WMI must stay on one thread)
    if let Some(sensors_config) = config.monitoring {
        thread::spawn(move || {
            let mut monitoring = Monitoring::new(monitoring_ctx, sensors_config);
            if let Err(e) = tokio::runtime::Builder::new_current_thread()
                .enable_all()
                .build()
                .unwrap()
                .block_on(monitoring.run())
            {
                eprintln!("Monitoring error: {}", e);
            }
        });
    }

    // Wait for all tasks to complete
    set.join_all().await;

    Ok(())
}
