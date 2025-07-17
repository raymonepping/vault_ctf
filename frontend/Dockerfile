# Use the official Node.js image (latest LTS 20.x)
FROM node:20.19.4-alpine

# Set working directory
WORKDIR /app

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

# Start Nuxt in dev mode (adjust for prod as needed)
CMD ["npm", "run", "dev"]