use serde::{Deserialize, Serialize};
use std::time::Duration;

use crate::event_bus::EventKind;
use crate::module::{Module, ModuleCtx};
use crate::reading::Reading;
use anyhow::{Context, Result};
use reqwest::Client;

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub url: String,
    pub key: String,
}

pub struct Uploader {
    ctx: ModuleCtx,
    client: reqwest::Client,
    config: Config,
}

impl Uploader {
    pub fn new(ctx: ModuleCtx, arguments: Config) -> Self {
        let client = Client::builder()
            .timeout(Duration::from_secs(30))
            .build()
            .expect("Failed to create HTTP client");

        Self {
            client,
            ctx,
            config: arguments,
        }
    }

    pub async fn send(&self, readings: Vec<Reading>) -> Result<()> {
        let response = self
            .client
            .post(&self.config.url)
            .header("private_key", &self.config.key)
            .json(&readings)
            .send()
            .await
            .context("Failed to send readings to API")?;

        if !response.status().is_success() {
            let error_text = response
                .text()
                .await
                .context("Failed to get error response text")?;
            anyhow::bail!("API request failed: {}", error_text);
        }

        Ok(())
    }
}

impl Module for Uploader {
    async fn run(&mut self) -> Result<()> {
        let mut interval = tokio::time::interval(tokio::time::Duration::from_secs(5));
        let mut batch: Vec<Reading> = vec![];

        loop {
            tokio::select! {
                e = self.ctx.receiver.recv() => {
                    match e {
                        Ok(event) => {
                            match event.inner {
                                EventKind::Log(_) => (),
                                EventKind::Reading(reading) => batch.push(reading)
                            }
                        },
                        Err(e) => println!("Error: {e}")
                    }
                },

                _ = interval.tick() => {
                    if batch.is_empty() {
                        continue;
                    }
                    
                    match self.send(batch.clone()).await {
                        Ok(_) => {
                            batch.clear();
                            self.ctx.send_log("Successfully uploaded values".into());
                        },
                        Err(e) => self.ctx.send_log(e.to_string()),
                    }
                }
            }
        }
    }
}
