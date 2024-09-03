use clap::Parser;
use proto::conditions_service_server::{ConditionsService, ConditionsServiceServer};
use proto::{ConditionsRequest, Reading};
use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use tonic::{transport::Server, Request, Response, Status};

mod config;
use config::Args;

mod time_helper;
use time_helper::TimeHelper;

pub mod proto {
    tonic::include_proto!("temperature");
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
    let mut cpu_temperature = Vec::new();
    let mut cpu_usage = Vec::new();
    let mut memory_usage = Vec::new();

    for reading in readings {
        if let (Some(timestamp), Some(conditions)) =
            (reading.timestamp.as_ref(), reading.condition.as_ref())
        {
            times.push(TimeHelper::to_offset_date_time(timestamp));
            cpu_temperature.push(conditions.cpu_temperature);
            cpu_usage.push(conditions.cpu_usage);
            memory_usage.push(conditions.memory_usage);
        }
    }

    if times.is_empty() {
        anyhow::bail!("No valid readings with timestamps found");
    }

    sqlx::query(
        r#"
        INSERT INTO conditions (
            time, 
            cpu_temperature, 
            cpu_usage, 
            memory_usage
        )
        SELECT * FROM UNNEST(
            $1::timestamptz[], 
            $2::real[], 
            $3::real[], 
            $4::real[]
        )
        "#,
    )
    .bind(&times)
    .bind(&cpu_temperature)
    .bind(&cpu_usage)
    .bind(&memory_usage)
    .execute(pool)
    .await?;

    Ok(())
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let args = Args::parse();

    println!("Starting server on {}", args.server_address);
    let pool = PgPoolOptions::new()
        .max_connections(args.max_connections)
        .connect(&args.database_url)
        .await?;
    println!("Connection to the DB was a success!");

    println!("Server is now up an running");
    Server::builder()
        .add_service(ConditionsServiceServer::new(MyTemperature { pool }))
        .serve(args.server_address)
        .await?;

    Ok(())
}
