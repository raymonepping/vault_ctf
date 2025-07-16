#!/bin/bash
set -euo pipefail

# Function to fetch the latest version of a Docker image from Docker Hub
fetch_latest_version() {
  local image_name="$1"
  curl -s "https://hub.docker.com/v2/repositories/${image_name}/tags/?page_size=100" \
    | jq -r '.results[].name' \
    | grep -Ev 'latest|stable|dockerhub' \
    | sort -Vr \
    | head -n 1
}

# Function to fetch the latest LTS/stable version matching a given pattern
fetch_latest_lts() {
  local image_name="$1"
  local version_pattern="$2"
  curl -s "https://hub.docker.com/v2/repositories/${image_name}/tags/?page_size=100" |
    jq -r '.results[].name' |
    grep -Ev 'latest|stable|dockerhub|rc|beta|alpha|test|fpm|cli|ubi|windows' |
    grep -E "$version_pattern" |
    sort -Vr |
    head -n 1
}

# -- VAULT & COUCHBASE --
couchbase_version=$(curl -s "https://hub.docker.com/v2/repositories/couchbase/server/tags/?page_size=100" \
  | jq -r '.results[].name' \
  | grep -Ev 'enterprise|latest|community|dockerhub' \
  | grep -E '^7.6.|^enterprise-7.6.' \
  | sort -Vr \
  | head -n 1)

# Function to check if a command exists and extract only the version
check_command() {
    if command -v "$1" >/dev/null 2>&1; then
        case "$1" in
            vault)    "$1" version | awk '{print $1, $2}' ;;  # Extracts "Vault vX.X.X"
            consul)   "$1" version | awk 'NR==1 {print $1, $2}' ;;  # Extracts "Consul vX.X.X"
            waypoint) "$1" version | awk 'NR==1 {print $1, $2}' ;;  # Extracts "Waypoint vX.X.X"
            docker)   "$1" --version | awk '{print $3}' ;;  # Extracts only the version number
            *)        "$1" "$2" | head -n 1 ;;  # Default case for other tools
        esac
    else
        echo "$1: Not Installed"
    fi
}


node20_alpine_version=$(curl -s "https://hub.docker.com/v2/repositories/library/node/tags/?page_size=100" \
  | jq -r '.results[].name' \
  | grep '^20\..*-alpine$' \
  | sort -Vr \
  | head -n 1)

# -- LTS / COMMON STACK VERSIONS --
node_lts_version=$(fetch_latest_lts "library/node" '^20\.[0-9]+\.[0-9]+$')
nginx_stable_version=$(fetch_latest_lts "library/nginx" '^1\.[0-9]+\.[0-9]+$')
traefik_version=$(fetch_latest_lts "library/traefik" '^[0-9]+\.[0-9]+\.[0-9]+$')

# -- OUTPUT --
echo "================================================================"
echo "|                     HashiCorp                                |"
echo "================================================================"
printf "| %-40s | %-15s |\n" "Latest Vault version" "$(check_command vault)"
echo "================================================================"
echo "|                     Couchbase                                |"
echo "================================================================"
printf "| %-40s | %-15s |\n" "Latest Couchbase version" "$couchbase_version"
echo "================================================================"
echo "|                      LTS VERSION LIST                        |"
echo "================================================================"
printf "| %-40s | %-15s |\n" "Latest Node.js LTS version" "${node_lts_version:-N/A}"
printf "| %-40s | %-15s |\n" "Latest Nginx LTS version" "${nginx_stable_version:-N/A}"
printf "| %-40s | %-15s |\n" "Latest Traefik version" "${traefik_version:-N/A}"
echo "================================================================"
