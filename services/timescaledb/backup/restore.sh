#!/bin/bash
set -e

if [ $# -eq 0 ]; then
    show_usage "Backup file path is required"
fi

BACKUP_FILE="$1"


# Pre-restore
echo "🔧 Running pre-restore..."
docker compose exec -T timescaledb psql \
    -U "$POSTGRES_USER" \
    -d "$POSTGRES_DB" \
    -c "SELECT timescaledb_pre_restore();"

# Restore
echo "💾 Restoring database..."
docker compose exec -T timescaledb pg_restore \
    -U "$POSTGRES_USER" \
    -d "$POSTGRES_DB" \
    --format=custom < "$BACKUP_FILE"

# Post-restore
echo "🔨 Running post-restore..."
docker compose exec -T timescaledb psql \
    -U "$POSTGRES_USER" \
    -d "$POSTGRES_DB" \
    -c "SELECT timescaledb_post_restore();"
