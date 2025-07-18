#!/usr/bin/env bash
set -euo pipefail
set -o errtrace

LEVEL_NAME="Level 02: Enabler of Engines"
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TARGET_FILE="${BASE_DIR}/backend/services/couchbasePool.js"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TPL_DIR="${SCRIPT_DIR}/../tpl"

run_prettier_if_available() {
  if command -v npx >/dev/null && npx prettier --version >/dev/null 2>&1; then
    echo "[FORMAT] Running Prettier on $TARGET_FILE..."
    npx prettier --write "$TARGET_FILE" >/dev/null
  else
    echo "[FORMAT] Skipped: Prettier not found."
  fi
}

before() {
  echo "[RESET] Reverting ${LEVEL_NAME} to BEFORE state..."

  awk '
    /require\(.*vaultService.*\)/ { next }
    /const vaultConfig *=.*getCouchbaseConfig/ { next }
    /const clusterConnStr/ {
      print "const clusterConnStr = process.env.COUCHBASE_URL; // ❌ BAD (hardcoded)"
      next
    }
    /const username/ {
      print "const username = process.env.COUCHBASE_USERNAME; // ❌ BAD (hardcoded)"
      next
    }
    /const password/ {
      print "const password = process.env.COUCHBASE_PASSWORD; // ❌ BAD (hardcoded)"
      next
    }
    { print }
  ' "$TARGET_FILE" > "${TARGET_FILE}.tmp" && mv "${TARGET_FILE}.tmp" "$TARGET_FILE"

  run_prettier_if_available

}

after() {
  echo "[APPLY] Transforming ${LEVEL_NAME} to AFTER state..."

  awk '
    BEGIN { inserted_import = 0; inserted_vault = 0 }

    # Insert Vault import after logger
    !inserted_import && /^const logger/ {
      print
      print ""
      print "const { getCouchbaseConfig } = require('\''./vaultService'\''); // ✅ GOOD (Vault import)"
      inserted_import = 1
      next
    }

    # Insert vaultConfig call after the shorter comment
    /\/\/ 🔑 Fetch Couchbase config/ && !inserted_vault {
      print
      print "    const vaultConfig = await getCouchbaseConfig() || {}; // ✅ GOOD (Vault config load)"
      inserted_vault = 1
      next
    }

    # Replace credential lines with vaultConfig
    /const clusterConnStr/ {
      print "    const clusterConnStr = vaultConfig.url; // ✅ GOOD (Vault)"
      next
    }
    /const username/ {
      print "    const username = vaultConfig.username; // ✅ GOOD (Vault)"
      next
    }
    /const password/ {
      print "    const password = vaultConfig.password; // ✅ GOOD (Vault)"
      next
    }

    { print }
  ' "$TARGET_FILE" > "${TARGET_FILE}.tmp" && mv "${TARGET_FILE}.tmp" "$TARGET_FILE"

    run_prettier_if_available

}

status() {
  echo -n "[STATUS] ${LEVEL_NAME}: "
  if grep -q "getCouchbaseConfig" "$TARGET_FILE"; then
    echo "✅ AFTER"
  elif grep -q "process.env.COUCHBASE_URL" "$TARGET_FILE"; then
    echo "❌ BEFORE"
  else
    echo "⚠️  UNKNOWN"
  fi
}

validate() {
  echo "[VALIDATE] Checking integrity for ${LEVEL_NAME}..."
  if [[ ! -f "$TARGET_FILE" ]]; then
    echo "❌ Target file not found: $TARGET_FILE"
    exit 1
  fi

  if grep -q "getCouchbaseConfig" "$TARGET_FILE"; then
    echo "✅ Vault import found."
  else
    echo "❌ Vault import missing."
    exit 1
  fi
}

init() {
  echo "[INIT] Creating template placeholder for ${LEVEL_NAME}..."
  mkdir -p "$TPL_DIR"
  TEMPLATE_FILE="${TPL_DIR}/level_02_readme.tpl"
  cat > "$TEMPLATE_FILE" <<EOF
## ${LEVEL_NAME}

🚀 Description:
Read Couchbase connection info from Vault instead of using hardcoded or environment values.

🛠️ Before:
\`\`\`js
const clusterConnStr = process.env.COUCHBASE_URL || 'couchbase://nosql';
const username = process.env.COUCHBASE_USERNAME || 'Administrator';
const password = process.env.COUCHBASE_PASSWORD || '';
\`\`\`

✅ After:
\`\`\`js
const { getCouchbaseConfig } = require('./vaultService');
const vaultConfig = await getCouchbaseConfig();
const clusterConnStr = vaultConfig.url || 'couchbase://nosql';
const username = vaultConfig.username || 'Administrator';
const password = vaultConfig.password || '';
\`\`\`

EOF
  echo "✅ Template created at ${TEMPLATE_FILE}"
}

"$@"
