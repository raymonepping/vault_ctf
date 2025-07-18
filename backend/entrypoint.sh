#!/bin/bash
set -e

log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO] [backend]: $*"
}

log "⏳ Waiting for Couchbase to become healthy..."

until curl -sf http://nosql:8091/ui/index.html > /dev/null; do
  log "🔄 Still waiting on Couchbase..."
  sleep 2
done

log "✅ Couchbase is healthy. Starting backend..."

exec npm start
# exec npx nodemon index.js