docker compose exec -T timescaledb pg_restore \
 -U username \
 -d database < backup.sql.zst