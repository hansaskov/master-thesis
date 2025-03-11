use anyhow::{Context, Result};
use sqlx::{sqlite::SqlitePool, Row};
use std::fs::File;
use std::path::Path;
use std::time::{Duration, UNIX_EPOCH};

use crate::reading::Reading;

pub trait LocalQueue {
    async fn new(db_url: &str) -> Result<Self>
    where
        Self: Sized;
    async fn push(&self, reading: Reading) -> Result<()>;
    async fn peek(&self, limit: usize) -> Result<Vec<Reading>>;
    async fn pop(&self, limit: usize) -> Result<()>;
    async fn len(&self) -> Result<usize>;
}

pub struct SqliteQueue {
    pool: SqlitePool,
}

impl LocalQueue for SqliteQueue {
    async fn new(db_url: &str) -> Result<Self> {
        if db_url != "sqlite::memory:" {
            let file_path = db_url.trim_start_matches("sqlite:");

            if !Path::new(file_path).exists() {
                File::create(file_path).context("Failed to create SQLite database file")?;
            }
        }

        let pool = SqlitePool::connect(db_url)
            .await
            .context("Failed to connect to SQLite database")?;

        sqlx::query(
            "CREATE TABLE IF NOT EXISTS readings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp_nanos INTEGER NOT NULL,
                name TEXT NOT NULL,
                value REAL NOT NULL,
                unit TEXT NOT NULL,
                category TEXT
            )",
        )
        .execute(&pool)
        .await
        .context("Failed to create readings table")?;

        Ok(Self { pool })
    }

    async fn push(&self, reading: Reading) -> Result<()> {
        let timestamp_nanos = reading
            .time
            .duration_since(UNIX_EPOCH)
            .context("Invalid timestamp: before UNIX epoch")?
            .as_nanos() as i64;

        sqlx::query(
            "INSERT INTO readings (timestamp_nanos, name, value, unit, category) VALUES (?, ?, ?, ?, ?)",
        )
        .bind(timestamp_nanos)
        .bind(&reading.name)
        .bind(reading.value)
        .bind(&reading.unit)
        .bind(&reading.category)
        .execute(&self.pool)
        .await
        .context("Failed to insert reading into database")?;

        Ok(())
    }

    async fn peek(&self, limit: usize) -> Result<Vec<Reading>> {
        let rows = sqlx::query(
            "SELECT timestamp_nanos, name, value, unit, category FROM readings ORDER BY id ASC LIMIT ?",
        )
        .bind(limit as i64)
        .fetch_all(&self.pool)
        .await
        .context("Failed to fetch readings from database")?;

        let readings: Result<Vec<Reading>> = rows
            .into_iter()
            .map(|row| {
                let nanos: i64 = row
                    .try_get("timestamp_nanos")
                    .context("Failed to get timestamp_nanos")?;

                let duration = Duration::from_nanos(nanos as u64);
                let timestamp = UNIX_EPOCH + duration;

                Ok(Reading {
                    time: timestamp,
                    name: row.try_get("name").context("Failed to get name")?,
                    value: row.try_get("value").context("Failed to get value")?,
                    unit: row.try_get("unit").context("Failed to get unit")?,
                    category: row.try_get("category").context("Failed to get category")?,
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

    async fn len(&self) -> Result<usize> {
        let row = sqlx::query("SELECT COUNT(*) as count FROM readings")
            .fetch_one(&self.pool)
            .await
            .context("Failed to get count of readings from database")?;

        let count: i64 = row
            .try_get("count")
            .context("Failed to get count from row")?;

        count
            .try_into()
            .context("Failed to convert count from i64 to usize")
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::time::{Duration, SystemTime};

    fn create_reading(name: &str, value: f32, unit: &str, categoty: Option<String>) -> Reading {
        Reading {
            time: SystemTime::now(),
            name: name.to_string(),
            value,
            unit: unit.to_string(),
            category: categoty,
        }
    }

    fn create_reading_with_timestamp(
        name: &str,
        value: f32,
        unit: &str,
        offset: Duration,
        category: Option<String>,
    ) -> Reading {
        Reading {
            time: UNIX_EPOCH + offset,
            name: name.to_string(),
            value,
            unit: unit.to_string(),
            category,
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
        let reading = create_reading("test", 42.0, "units", Some("cat".into()));

        queue.push(reading.clone()).await?;
        let peeked = queue.peek(1).await?;

        assert_eq!(peeked.len(), 1);
        // Compare fields individually since SystemTime might have microsecond differences
        assert_eq!(peeked[0].name, reading.name);
        assert_eq!(peeked[0].value, reading.value);
        assert_eq!(peeked[0].unit, reading.unit);
        assert_eq!(peeked[0].category, reading.category);
        Ok(())
    }

    #[tokio::test]
    async fn test_push_and_peek_multiple() -> Result<()> {
        let queue = SqliteQueue::new("sqlite::memory:").await?;

        // Create readings with specific timestamps for reliable comparison
        let readings = [
            create_reading_with_timestamp(
                "test1",
                1.0,
                "units",
                Duration::from_secs(1000),
                Some("doors1".into()),
            ),
            create_reading_with_timestamp(
                "test2",
                2.0,
                "units",
                Duration::from_secs(2000),
                Some("doors2".into()),
            ),
            create_reading_with_timestamp(
                "test3",
                3.0,
                "units",
                Duration::from_secs(3000),
                Some("doors3".into()),
            ),
        ];

        for reading in readings.iter() {
            queue.push(reading.clone()).await?;
        }

        let peeked = queue.peek(3).await?;
        assert_eq!(peeked.len(), 3);

        // Compare each reading's fields
        for (peeked_reading, original_reading) in peeked.iter().zip(readings.iter()) {
            assert_eq!(peeked_reading.time, original_reading.time);
            assert_eq!(peeked_reading.name, original_reading.name);
            assert_eq!(peeked_reading.value, original_reading.value);
            assert_eq!(peeked_reading.unit, original_reading.unit);
            assert_eq!(peeked_reading.category, original_reading.category);
        }
        Ok(())
    }

    #[tokio::test]
    async fn test_pop() -> Result<()> {
        let queue = SqliteQueue::new("sqlite::memory:").await?;
        let readings = [
            create_reading_with_timestamp("test1", 1.0, "units", Duration::from_secs(1000), None),
            create_reading_with_timestamp("test2", 2.0, "units", Duration::from_secs(2000), None),
            create_reading_with_timestamp("test3", 3.0, "units", Duration::from_secs(3000), None),
        ];

        for reading in readings.iter() {
            queue.push(reading.clone()).await?;
        }

        queue.pop(2).await?;
        let remaining = queue.peek(3).await?;
        assert_eq!(remaining.len(), 1);
        assert_eq!(remaining[0].name, readings[2].name);
        assert_eq!(remaining[0].value, readings[2].value);
        assert_eq!(remaining[0].unit, readings[2].unit);
        Ok(())
    }

    #[tokio::test]
    async fn test_peek_limit() -> Result<()> {
        let queue = SqliteQueue::new("sqlite::memory:").await?;
        for i in 0..5 {
            queue
                .push(create_reading(
                    &format!("test{}", i),
                    i as f32,
                    "units",
                    None,
                ))
                .await?;
        }

        let peeked = queue.peek(3).await?;
        assert_eq!(peeked.len(), 3);
        Ok(())
    }

    #[tokio::test]
    async fn test_len_empty() -> Result<()> {
        let queue = SqliteQueue::new("sqlite::memory:").await?;
        assert_eq!(queue.len().await?, 0);
        Ok(())
    }

    #[tokio::test]
    async fn test_len_non_empty() -> Result<()> {
        let queue = SqliteQueue::new("sqlite::memory:").await?;
        for i in 0..5 {
            queue
                .push(create_reading(
                    &format!("test{}", i),
                    i as f32,
                    "units",
                    None,
                ))
                .await?;
        }
        assert_eq!(queue.len().await?, 5);
        Ok(())
    }

    #[tokio::test]
    async fn test_invalid_timestamp() -> Result<()> {
        let queue = SqliteQueue::new("sqlite::memory:").await?;

        // Create a reading with a timestamp before UNIX_EPOCH
        let invalid_reading = Reading {
            time: UNIX_EPOCH - Duration::from_secs(1),
            name: "test".to_string(),
            value: 42.0,
            unit: "units".to_string(),
            category: None,
        };

        // This should return an error
        assert!(queue.push(invalid_reading).await.is_err());
        Ok(())
    }
}
