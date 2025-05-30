#!/usr/bin/env nu
docker compose stop timescaledb
docker compose run --rm --entrypoint "find /home/postgres/pgdata/data -mindepth 1 -delete" timescaledb
docker compose run --rm --entrypoint "pgbackrest --log-level-console=info restore" timescaledb
docker compose up timescaledb -d
