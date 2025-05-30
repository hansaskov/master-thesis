-- Custom SQL migration file, put your code below! --
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;
CREATE EXTENSION IF NOT EXISTS timescaledb_toolkit CASCADE;
SELECT create_hypertable('readings', by_range('time'), if_not_exists => TRUE, migrate_data => TRUE );