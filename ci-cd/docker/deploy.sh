#!/bin/bash
set -euo pipefail

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# 1. Get id of current (oldest) container
OLD_CONTAINER=$(docker compose -f ./compose.yaml ps backend --quiet)
log "🔍 Current (oldest) container ID: $OLD_CONTAINER"

# 2. Scale backend containers to 2 without rebuilding old container
log "🚀 Scaling up to 2 containers..."
docker compose -f ./compose.yaml up backend --no-deps --scale backend=2 --no-recreate --wait -d

# 3. Stop and remove the oldest container
if [ ! -z "$OLD_CONTAINER" ]; then
    log "🛑 Stopping oldest container: $OLD_CONTAINER"
    docker stop $OLD_CONTAINER
    docker rm $OLD_CONTAINER
    log "✅ Old container removed successfully"
else
    log "❌ Error: Could not identify the old container"
    exit 1
fi

# 4. Verify we're running with single new container
log "🎯 Update process completed successfully"
docker compose -f ./compose.yaml ps backend