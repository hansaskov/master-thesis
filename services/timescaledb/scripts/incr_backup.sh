docker compose exec timescaledb pgbackrest --log-level-console=info stanza-create
docker compose exec timescaledb pgbackrest --log-level-console=info check
docker compose exec timescaledb pgbackrest --log-level-console=info --type=incr backup