#!/usr/bin/env bash
set -euo pipefail
set -o errtrace

LEVEL_NAME="Level 01: Remove Hardcoded API Key"
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TARGET_FILE="${BASE_DIR}/backend/configurations/couchbaseConfig.js"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TPL_DIR="${SCRIPT_DIR}/../tpl"


before() {
  echo "[RESET] Reverting ${LEVEL_NAME} to BEFORE state..."
  awk '
    /^const apiKey *=/ {
      print "const apiKey = '\''my-super-secret-123456'\''; // ❌ BAD (hardcoded secret)"
      next
    }
    { print }
  ' "$TARGET_FILE" > "${TARGET_FILE}.tmp" && mv "${TARGET_FILE}.tmp" "$TARGET_FILE"
}

after() {
  echo "[APPLY] Transforming ${LEVEL_NAME} to AFTER state..."
  awk '
    /^const apiKey *=/ {
      print "const apiKey = process.env.VAULT_API_KEY; // ✅ GOOD (use environment variable)"
      next
    }
    { print }
  ' "$TARGET_FILE" > "${TARGET_FILE}.tmp" && mv "${TARGET_FILE}.tmp" "$TARGET_FILE"
}

status() {
  echo -n "[STATUS] ${LEVEL_NAME}: "
  if grep -q "process.env.VAULT_API_KEY" "$TARGET_FILE"; then
    echo "✅ AFTER"
  elif grep -q "my-super-secret-123456" "$TARGET_FILE"; then
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

  if grep -q "const apiKey" "$TARGET_FILE"; then
    echo "✅ apiKey line exists."
  else
    echo "❌ apiKey line is missing."
    exit 1
  fi
}

init() {
  echo "[INIT] Creating template placeholder for ${LEVEL_NAME}..."
  mkdir -p "$TPL_DIR"
  TEMPLATE_FILE="${TPL_DIR}/level_01_readme.tpl"
  cat > "$TEMPLATE_FILE" <<EOF
## ${LEVEL_NAME}

🧪 Description:
Replace hardcoded secrets with secure Vault-injected values.

🧪 Challenge:
Find the hardcoded API key in \`couchbaseConfig.js\` and refactor it to use \`process.env.VAULT_API_KEY\`.

🛠️ Before:
\`\`\`js
const apiKey = 'my-super-secret-123456';
\`\`\`

✅ After:
\`\`\`js
const apiKey = process.env.VAULT_API_KEY;
\`\`\`

EOF
  echo "✅ Template created at ${TEMPLATE_FILE}"
}

"$@"
