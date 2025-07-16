#!/bin/bash

# List of services to stop
services=("flour" "butter" "nutmeg" "vanilla" "cherry")

# Function to display service status
show_status() {
    echo -e "\n\033[1mCurrent status of services:\033[0m"
    for service in "${services[@]}"
    do
        status=$(docker-compose ps --services --filter "status=running" | grep -w "$service")
        if [ -n "$status" ]; then
            echo -e "  ✔ \033[32m$service is running\033[0m"
        else
            echo -e "  ✗ \033[31m$service is stopped\033[0m"
        fi
    done
    echo
}

# Header for initial status
echo -e "\033[1;34m====== Initial Status ======\033[0m"
show_status

# Stop the services one by one
echo -e "\033[1;34mStopping services...\033[0m"
for service in "${services[@]}"
do
    # Check if the service is running
    status=$(docker-compose ps --services --filter "status=running" | grep -w "$service")
    if [ -z "$status" ]; then
        echo -e "  ➤ Skipping \033[33m$service\033[0m (already stopped)"
    else
        echo -e "  ➤ Stopping \033[32m$service\033[0m"
        docker-compose stop "$service" > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            echo -e "    ✔ \033[32mSuccessfully stopped $service\033[0m"
        else
            echo -e "    ✗ \033[31mFailed to stop $service\033[0m"
            exit 1
        fi
    fi
    echo
done

# Header for final status
echo -e "\033[1;34m====== Final Status ======\033[0m"
show_status

# Success message
echo -e "\033[1;32mAll services stopped successfully.\033[0m\n"
