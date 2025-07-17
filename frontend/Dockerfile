# Use the official Node.js image (latest LTS 20.x)
FROM node:20.19.4-alpine

# Set working directory
WORKDIR /app

# Install curl for health check
RUN apk add --no-cache curl

# Copy package manifests
COPY package*.json ./

# Install dependencies (use legacy-peer-deps if needed for Tailwind/Vite conflicts)
RUN npm install --legacy-peer-deps

# Copy all app files
COPY . .

# Expose Nuxt default port
EXPOSE 8075

# Prevent CLI prompt in Docker
ENV NUXT_CLI_DISABLE_PROMPT=true

# Use the entrypoint script to wait for Backend before starting Nuxt
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

# Start Nuxt in dev mode (adjust for prod as needed)
CMD ["npm", "run", "dev"]