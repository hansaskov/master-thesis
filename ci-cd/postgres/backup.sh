#!/bin/bash
set -e

if [ $# -eq 0 ]; then
    show_usage "Backup file path is required"
fi

BACKUP_FILE="$1"

docker compose exec timescaledb pg_dump \
    -U "$POSTGRES_USER" \
    -d "$POSTGRES_DB" \
    --format=custom > "$BACKUP_FILE"