#!/bin/bash

# ./list_containers.sh sort=name | status | label

# Function to display usage
function usage() {
  echo "Usage: $0 sort=<name|status|label>"
  echo "Sort containers by name (default), status, or label."
  exit 1
}

# Parse input argument
sort_by="name" # Default sorting by name
if [[ $1 == sort=* ]]; then
  case "${1#*=}" in
    name) sort_by="name" ;;
    status) sort_by="status" ;;
    label) sort_by="label" ;;
    *) usage ;;
  esac
elif [[ -n "$1" ]]; then
  usage
fi

# Remove all dangling images
docker image prune -f

# Declare an array to hold container information
declare -a containers_info=()

# Define the target container names
target_containers=(
  "butter"
  "cherry"
  "flour" 
  "nutmeg"
  "vanilla"
  )

# Loop through all containers (running and stopped)
for container in $(docker ps -aq); do
  # Get the container name
  container_name=$(docker inspect --format '{{.Name}}' $container | cut -c 2-)
  
  # Check if the container is in the target list
  if [[ ! " ${target_containers[@]} " =~ " $container_name " ]]; then
    continue
  fi

  # Get the container status
  container_status=$(docker inspect --format '{{.State.Status}}' $container)
  # Replace 'exited' with 'stopped'
  if [[ "$container_status" == "exited" ]]; then
    container_status="stopped"
  fi

  # Get the container label (handle missing labels)
  container_label=$(docker inspect --format '{{index .Config.Labels "category"}}' $container 2>/dev/null)

  # Only add containers that have a non-empty label
  if [[ -n "$container_label" ]]; then
    containers_info+=("$container_name $container_status $container_label")
  fi
done

# Sort the container info array based on user input
case $sort_by in
  name)
    IFS=$'\n' sorted_containers=($(sort <<<"${containers_info[*]}"))
    ;;
  status)
    IFS=$'\n' sorted_containers=($(sort -k2 <<<"${containers_info[*]}"))
    ;;
  label)
    IFS=$'\n' sorted_containers=($(sort -k3 <<<"${containers_info[*]}"))
    ;;
esac
unset IFS

# Print headers
printf "%-20s %-15s %-15s\n" "CONTAINER NAME" "STATUS" "LABEL"
printf "%-20s %-15s %-15s\n" "--------------" "------" "-----"

# Print sorted container information with color coding
for container_info in "${sorted_containers[@]}"; do
  # Extract container name, status, and label from the sorted array
  container_name=$(echo $container_info | awk '{print $1}')
  container_status=$(echo $container_info | awk '{print $2}')
  container_label=$(echo $container_info | awk '{print $3}')

  # Color coding: green for running, red for stopped
  if [[ "$container_status" == "running" ]]; then
    color="\033[0;32m" # Green
  else
    color="\033[0;31m" # Red
  fi
  no_color="\033[0m"

  # Print the container info with color
  printf "${color}%-20s %-15s %-15s${no_color}\n" "$container_name" "$container_status" "$container_label"
done
