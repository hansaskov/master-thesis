-- Custom SQL migration file, put your code below! --
SELECT create_hypertable('readings', by_range('time'), if_not_exists => TRUE, migrate_data => TRUE );