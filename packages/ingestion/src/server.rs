use clap::Parser;
use prost_types::value;
use proto::conditions_service_server::{ConditionsService, ConditionsServiceServer};
use proto::{ConditionsRequest, Reading};
use sqlx::migrate::Migrator;
use sqlx::postgres::PgPoolOptions;
use sqlx::{migrate, PgPool};
use tonic::{transport::Server, Request, Response, Status};

mod config;
use config::Args;

mod time_helper;
use time_helper::TimeHelper;

pub mod proto {
    tonic::include_proto!("reading");
}
pub struct MyTemperature {
    pool: sqlx::PgPool,
}

#[tonic::async_trait]
impl ConditionsService for MyTemperature {
    async fn send_conditions(
        &self,
        request: Request<ConditionsRequest>,
    ) -> Result<Response<proto::Empty>, Status> {
        let readings = request.get_ref().readings.clone();

        if readings.is_empty() {
            return Err(Status::invalid_argument("The provided request is empty"));
        }

        match insert_many_readings(&readings, &self.pool).await {
            Ok(_) => {
                println!("Successfully inserted {} readings", readings.len());
                Ok(Response::new(proto::Empty {}))
            }
            Err(e) => Err(Status::internal(format!(
                "Failed to insert readings: {}",
                e
            ))),
        }
    }
}

pub async fn insert_many_readings(readings: &[Reading], pool: &PgPool) -> anyhow::Result<()> {
    let mut times = Vec::new();
    let mut names = Vec::new();
    let mut values = Vec::new();
    let mut unit = Vec::new();

    for reading in readings {
        if let Some(timestamp) = reading.timestamp.as_ref() {
            times.push(TimeHelper::to_offset_date_time(timestamp));
            names.push(reading.name.clone());
            values.push(reading.value);
            unit.push(reading.unit.clone());
        }
    }

    if times.is_empty() {
        anyhow::bail!("No valid readings with timestamps found");
    }

    sqlx::query(
        r#"
        INSERT INTO conditions (
            time, 
            name, 
            value,
            unit
        )
        SELECT * FROM UNNEST(
            $1::timestamptz[], 
            $2::text[], 
            $3::real[],
            $4::text[]
        )
        "#,
    )
    .bind(&times)
    .bind(&names)
    .bind(&values)
    .bind(&unit)
    .execute(pool)
    .await?;

    Ok(())
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let args = Args::parse();

    println!("Starting server on {}", args.database_url);
    let pool = PgPoolOptions::new()
        .max_connections(args.max_connections)
        .connect(&args.database_url)
        .await?;
    println!("Connection to the DB was a success!");

    sqlx::migrate!("db/migrations").run(&pool).await?;

    println!("Server is now up an running");
    Server::builder()
        .add_service(ConditionsServiceServer::new(MyTemperature { pool }))
        .serve(args.server_address)
        .await?;

    Ok(())
}
