use anyhow::{Context, Result};
use prost_types::Timestamp;
use sqlx::{sqlite::SqlitePool, Row};
use std::time::{SystemTime, UNIX_EPOCH};

use crate::reading::Reading;

pub trait LocalQueue {
    async fn new(db_url: &str) -> Result<Self>
    where
        Self: Sized; // new() will return a new instance of the local queue
    async fn push(&self, reading: Reading) -> Result<()>; // push() will add a new reading to the local queue
    async fn peek(&self, limit: usize) -> Result<Vec<Reading>>; // peek() will return the next n readings from the local queue
    async fn pop(&self, limit: usize) -> Result<()>; // pop() will remove the next n readings from the local queue.
}

pub struct SqliteQueue {
    pool: SqlitePool,
}

impl LocalQueue for SqliteQueue {
    async fn new(db_url: &str) -> Result<Self> {
        let pool = SqlitePool::connect(db_url)
            .await
            .context("Failed to connect to SQLite database")?;

        sqlx::query(
            "CREATE TABLE IF NOT EXISTS readings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp INTEGER NOT NULL,
                name TEXT NOT NULL,
                value REAL NOT NULL,
                unit TEXT NOT NULL
            )",
        )
        .execute(&pool)
        .await
        .context("Failed to create readings table")?;

        Ok(Self { pool })
    }

    async fn push(&self, reading: Reading) -> Result<()> {
        let timestamp = reading.timestamp.map(|ts| ts.seconds).unwrap_or_else(|| {
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .expect("Time went backwards")
                .as_secs()
                .try_into()
                .expect("Timestamp overflow")
        });

        sqlx::query("INSERT INTO readings (timestamp, name, value, unit) VALUES (?, ?, ?, ?)")
            .bind(timestamp)
            .bind(&reading.name)
            .bind(reading.value)
            .bind(&reading.unit)
            .execute(&self.pool)
            .await
            .context("Failed to insert reading into database")?;

        Ok(())
    }

    async fn peek(&self, limit: usize) -> Result<Vec<Reading>> {
        let rows = sqlx::query(
            "SELECT timestamp, name, value, unit FROM readings ORDER BY id ASC LIMIT ?",
        )
        .bind(limit as i64)
        .fetch_all(&self.pool)
        .await
        .context("Failed to fetch readings from database")?;

        let readings: Result<Vec<Reading>> = rows
            .into_iter()
            .map(|row| {
                Ok(Reading {
                    timestamp: Some(Timestamp {
                        seconds: row
                            .try_get("timestamp")
                            .context("Failed to get timestamp")?,
                        nanos: 0,
                    }),
                    name: row.try_get("name").context("Failed to get name")?,
                    value: row.try_get("value").context("Failed to get value")?,
                    unit: row.try_get("unit").context("Failed to get unit")?,
                })
            })
            .collect();

        readings.context("Failed to process readings from database")
    }

    async fn pop(&self, limit: usize) -> Result<()> {
        sqlx::query(
            "DELETE FROM readings WHERE id IN (
                SELECT id FROM readings ORDER BY id ASC LIMIT ?
            )",
        )
        .bind(limit as i64)
        .execute(&self.pool)
        .await
        .context("Failed to delete readings from database")?;

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use crate::reading;

    use super::*;
    use prost_types::Timestamp;
    use tokio;

    fn create_reading(name: &str, value: f32, unit: &str) -> Reading {
        Reading {
            timestamp: Some(Timestamp {
                seconds: SystemTime::now()
                    .duration_since(UNIX_EPOCH)
                    .unwrap()
                    .as_secs() as i64,
                nanos: 0,
            }),
            name: name.to_string(),
            value,
            unit: unit.to_string(),
        }
    }

    #[tokio::test]
    async fn test_new_queue() -> Result<()> {
        let queue = SqliteQueue::new("sqlite::memory:").await?;
        assert!(queue.pool.acquire().await.is_ok());
        Ok(())
    }

    #[tokio::test]
    async fn test_push_and_peek_single() -> Result<()> {
        let queue = SqliteQueue::new("sqlite::memory:").await?;
        let reading = create_reading("test", 42.0, "units");

        queue.push(reading.clone()).await?;
        let peeked = queue.peek(1).await?;

        assert_eq!(peeked.len(), 1);
        assert_eq!(peeked[0], reading);
        Ok(())
    }

    #[tokio::test]
    async fn test_push_and_peek_multiple() -> Result<()> {
        let queue = SqliteQueue::new("sqlite::memory:").await?;
        let readings = vec![
            create_reading("test1", 1.0, "units"),
            create_reading("test2", 2.0, "units"),
            create_reading("test3", 3.0, "units"),
        ];

        for reading in readings.iter() {
            queue.push(reading.clone()).await?;
        }

        let peeked = queue.peek(3).await?;
        assert_eq!(peeked.len(), 3);
        assert_eq!(peeked, readings);
        Ok(())
    }

    #[tokio::test]
    async fn test_pop() -> Result<()> {
        let queue = SqliteQueue::new("sqlite::memory:").await?;
        let readings = vec![
            create_reading("test1", 1.0, "units"),
            create_reading("test2", 2.0, "units"),
            create_reading("test3", 3.0, "units"),
        ];

        for reading in readings.iter() {
            queue.push(reading.clone()).await?;
        }

        queue.pop(2).await?;
        let remaining = queue.peek(3).await?;
        assert_eq!(remaining.len(), 1);
        assert_eq!(remaining[0], readings[2]);
        Ok(())
    }

    #[tokio::test]
    async fn test_peek_limit() -> Result<()> {
        let queue = SqliteQueue::new("sqlite::memory:").await?;
        for i in 0..5 {
            queue
                .push(create_reading(&format!("test{}", i), i as f32, "units"))
                .await?;
        }

        let peeked = queue.peek(3).await?;
        assert_eq!(peeked.len(), 3);
        Ok(())
    }
}
