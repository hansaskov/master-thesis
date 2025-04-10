-- Custom SQL migration file, put your code below! --
ALTER MATERIALIZED VIEW "public"."system_health" set (timescaledb.materialized_only = false);