#!/bin/bash
set -e

# Colors for output formatting
GREEN="\033[0;32m"
RED="\033[0;31m"
CYAN="\033[0;36m"
NC="\033[0m" # No color

# Max retry attempts
max_retries=3

# Temp files to store the push results
pushed_temp=$(mktemp)
failed_temp=$(mktemp)

# Function to check if Docker login has been done
docker_login_check() {
  if ! docker info > /dev/null 2>&1; then
    echo -e "${CYAN}You need to log in to Docker Hub.${NC}"
    docker login
    if [ $? -ne 0 ]; then
      echo -e "${RED}Docker login failed. Exiting...${NC}"
      exit 1
    fi
  fi
}

# Check if the images exist locally
check_image_exists() {
  local image=$1
  if ! docker image inspect "$image" > /dev/null 2>&1; then
    echo -e "${RED}Error: No such image: $image. Please build it first.${NC}"
    return 1
  fi
  return 0
}

# Progress bar function
progress_bar() {
  local duration=$1
  already_done() { for ((done=0; done<$elapsed; done++)); do printf "▇"; done }
  remaining() { for ((remain=$elapsed; remain<$duration; remain++)); do printf " "; done }
  percentage() { printf "| %s%%" $(( ($elapsed * 100) / $duration )); }
  for ((elapsed=1; elapsed<=$duration; elapsed++)); do
    already_done; remaining; percentage
    sleep 0.2
    printf "\r"
  done
  printf "\n"
}

# Retry function for pushing images
retry_push_image() {
  local image_name=$1
  local docker_hub_image=$2
  local retries=0
  local success=false

  until [ "$success" = true ] || [ $retries -ge $max_retries ]; do
    echo -e "${CYAN}Attempt $((retries+1))/$max_retries: Tagging and pushing $image_name as $docker_hub_image...${NC}"
    
    docker tag "$image_name" "$docker_hub_image" > /dev/null 2>&1
    docker push "$docker_hub_image" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}Successfully pushed $docker_hub_image${NC}"
      echo "$docker_hub_image" >> "$pushed_temp"
      success=true
    else
      echo -e "${RED}Failed to push $docker_hub_image. Retrying...${NC}"
      ((retries++))
    fi

    # Progress bar for the push operation
    progress_bar 10
  done

  # If after all retries it failed, mark as failed
  if [ "$success" = false ]; then
    echo -e "${RED}Failed to push $docker_hub_image after $max_retries attempts.${NC}"
    echo "$docker_hub_image" >> "$failed_temp"
  fi
}

# Function to push custom-built images in parallel
push_image_parallel() {
  local image_name=$1
  local docker_hub_image_latest=$2
  local docker_hub_image_versioned=$3
  check_image_exists "$image_name"
  if [ $? -eq 0 ]; then
    retry_push_image "$image_name" "$docker_hub_image_latest"
    retry_push_image "$image_name" "$docker_hub_image_versioned"
  else
    echo "$docker_hub_image_latest" >> "$failed_temp" # Mark as failed if the image doesn't exist
    echo "$docker_hub_image_versioned" >> "$failed_temp" # Mark as failed if the image doesn't exist
  fi
}

# Docker login check
docker_login_check

# Custom tag (passed as argument or defaults to "latest" and "1.0.0" version)
custom_version=${1:-1.0.0}

# List of services to push
services=(
  "couchbase-bakeray-butter:repping/butter"
  "couchbase-bakeray-flour:repping/flour"
)

# Array to hold background process IDs
declare -a pids=()

# Push each service in parallel
for service in "${services[@]}"; do
  image_name="${service%%:*}"
  docker_hub_image_latest="repping/${image_name#couchbase-bakeray-}:latest"
  docker_hub_image_versioned="repping/${image_name#couchbase-bakeray-}:$custom_version"
  push_image_parallel "$image_name" "$docker_hub_image_latest" "$docker_hub_image_versioned" &
  pids+=($!)  # Save process ID of the background job
done

# Wait for all background jobs to finish
for pid in "${pids[@]}"; do
  wait $pid
done

# Summary report function
summary_report() {
  echo -e "\n${CYAN}Summary of Docker Pushes:${NC}"

  if [ -s "$pushed_temp" ]; then
    echo -e "${GREEN}Successfully pushed images:${NC}"
    grep 'latest' "$pushed_temp" | sort
    grep -v 'latest' "$pushed_temp" | sort
  else
    echo -e "${RED}No images were successfully pushed.${NC}"
  fi

  if [ -s "$failed_temp" ]; then
    echo -e "\n${RED}Failed to push the following images:${NC}"
    cat "$failed_temp"
  fi
}

# Display summary report
summary_report

# Clean up temporary files
rm "$pushed_temp" "$failed_temp"
