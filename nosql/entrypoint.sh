#!/bin/bash
set -euo pipefail

VAULT_ADDR="${VAULT_ADDR:-http://vault:8200}"
MAX_RETRIES=30
RETRY_DELAY=2

echo "🕒 Waiting for Vault to be unsealed and active..."

for i in $(seq 1 "$MAX_RETRIES"); do
    status=$(curl -s "$VAULT_ADDR/v1/sys/health" || true)

    if echo "$status" | grep -q '"sealed":false' && echo "$status" | grep -q '"standby":false'; then
        echo "✅ Vault is unsealed and active. 🚀 Continuing startup..."
        break
    fi

    echo "🔄 [$i/$MAX_RETRIES] Vault not ready... retrying in ${RETRY_DELAY}s"
    sleep "$RETRY_DELAY"
done

# Handoff to original Couchbase entrypoint
echo "➡️  Executing original entrypoint: $@"
exec /entrypoint.sh "$@"
