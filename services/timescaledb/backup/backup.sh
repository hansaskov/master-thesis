docker compose exec timescaledb pg_dump \
 -U username \
 -d database \
 --format=custom \
 --data-only \
 --exclude-extension=timescaledb \
 --exclude-table='__drizzle_migrations' \
 --verbose \
 --no-owner > backup.sql.zst