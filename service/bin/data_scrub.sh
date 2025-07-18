#!/usr/bin/env bash
set -euo pipefail
set -o errtrace

disable_strict_mode() { set +e +u +o pipefail; }
enable_strict_mode() {
  set -euo pipefail
  set -o errtrace
}

# ==== METADATA ====
VERSION="1.1.0"
SCRIPT_NAME="$(basename "$0")"
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LIB_DIR="${BASE_DIR}/lib"
VALID_STATES=("before" "after")
VALID_COMMANDS=("before" "after" "status" "validate" "init")

# ==== FLAGS ====
LEVEL=""
STATE=""
DRYRUN=false
VERBOSE=false
LIST=false

# ==== HELP ====
usage() {
  cat <<EOF
🔧 ${SCRIPT_NAME} v${VERSION}

Usage:
  $SCRIPT_NAME --level <n|all> --state <before|after|status|validate|init> [--dryrun] [--verbose] [--list]

Options:
  --level <n|all>         Target level number or 'all'
  --state <command>       One of:
                            before   Reset file(s) to starting challenge state
                            after    Apply the target solution (post-challenge)
                            status   Show current status or file diff
                            validate Check whether solution is applied correctly
                            init     Bootstrap/setup files or metadata for level
  --dryrun                Print actions without executing
  --verbose               Show internal commands (debug)
  --list                  List available level scripts
  --help, -h              Show this help message
EOF
}

# ==== ARG PARSING ====
while [[ $# -gt 0 ]]; do
  case "$1" in
    --level)   LEVEL="$2"; shift 2 ;;
    --state)   STATE="$2"; shift 2 ;;
    --dryrun)  DRYRUN=true; shift ;;
    --verbose) VERBOSE=true; shift ;;
    --list)    LIST=true; shift ;;
    --help|-h) usage; exit 0 ;;
    *) echo "❌ Unknown argument: $1"; usage; exit 1 ;;
  esac
done

# ==== LIST MODE ====
if [[ "$LIST" == true ]]; then
  echo "📜 Available levels:"
  for script in "${LIB_DIR}"/level_*.sh; do
    [[ -f "$script" ]] && basename "$script" .sh
  done
  exit 0
fi

# ==== VALIDATION ====
if [[ -z "$STATE" ]]; then
  echo "❌ Missing required --state argument."
  usage
  exit 1
fi

if [[ "$STATE" =~ ^(validate|status|init)$ && -z "$LEVEL" ]]; then
  echo "❌ The '$STATE' command requires a specific --level or 'all'."
  exit 1
fi

if [[ -z "$LEVEL" && "$STATE" =~ ^(before|after)$ ]]; then
  echo "❌ Missing required --level argument."
  exit 1
fi

if [[ -z "$LEVEL" && "$STATE" =~ ^(before|after)$ ]]; then
  echo "❌ Missing required --level argument."
  usage
  exit 1
fi

if [[ ! " ${VALID_COMMANDS[*]} " =~ " $STATE " ]]; then
  echo "❌ Invalid state/command: $STATE"
  usage
  exit 1
fi

[[ "$VERBOSE" == true ]] && set -x

# ==== ALL LEVELS ====
if [[ "$LEVEL" == "all" ]]; then
  echo "⚠️  Applying '${STATE}' to ALL levels. Are you sure? [y/N]"
  read -r CONFIRM
  [[ "$CONFIRM" != "y" ]] && echo "Aborted." && exit 0

  for script in "${LIB_DIR}"/level_*.sh; do
    [[ -f "$script" ]] || continue
    echo "🔄 Running $(basename "$script") [$STATE]"
    $DRYRUN && echo "DRYRUN: bash $script $STATE" || bash "$script" "$STATE"
  done
  exit 0
fi

# ==== SINGLE LEVEL ====
LEVEL_PADDED=$(printf "%02d" "$LEVEL")
SCRIPT="${LIB_DIR}/level_${LEVEL_PADDED}.sh"

if [[ -f "$SCRIPT" ]]; then
  echo "▶️  Executing level ${LEVEL} [$STATE]"
  $DRYRUN && echo "DRYRUN: bash $SCRIPT $STATE" || bash "$SCRIPT" "$STATE"
else
  echo "❌ No script found for level $LEVEL"
  exit 1
fi
