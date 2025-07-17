#!/bin/sh
set -e

# Colors and log helper
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO] [frontend]: $1"
}

# Wait for backend to be healthy
log "⏳ Waiting for backend to become healthy..."

until curl -sSf http://backend:3000/api/health > /dev/null; do
  sleep 2
done

log "✅ Backend is healthy. Starting frontend..."

# Execute Nuxt startup
exec "$@"
