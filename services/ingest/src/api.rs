use crate::reading::Reading;
use anyhow::Context;
use reqwest::Client;
use std::time::Duration;

pub trait ApiClientInterface {
    async fn send(&self, readings: Vec<Reading>) -> anyhow::Result<()>;
}

pub struct APIClient {
    client: Client,
    endpoint: String,
    private_key: String,
}

impl APIClient {
    pub fn new(endpoint: String, private_key: String) -> Self {
        let client = Client::builder()
            .timeout(Duration::from_secs(30))
            .build()
            .expect("Failed to create HTTP client");

        Self {
            client,
            endpoint,
            private_key,
        }
    }
}

impl ApiClientInterface for APIClient {
    async fn send(&self, readings: Vec<Reading>) -> anyhow::Result<()> {
        let response = self
            .client
            .post(&self.endpoint)
            .header("private_key", &self.private_key)
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
