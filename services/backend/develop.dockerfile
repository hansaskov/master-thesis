# Use Bun (JavaScript runtime) image as the base
FROM oven/bun:1.2 AS build

# Set the working directory to /app inside the container
WORKDIR /app

# Copy necessary package files to install dependencies
COPY bun.lock package.json /app/
COPY /services/backend/package.json /app/services/backend/
COPY /services/frontend/package.json /app/services/frontend/

# Install dependencies using Bun
RUN bun install

# Copy the rest of your app's source code
COPY /services/backend /app/services/backend

# Move directory to backend
WORKDIR /app/services/backend

# Expose port 3000 for the development server
EXPOSE 3000