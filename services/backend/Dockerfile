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

# Build the backend using Bun
ENV NODE_ENV=production

# Will create a binary executable with the name of server
RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile server \
	./services/backend/src/index.ts

# Get the httpget utility for healthchecks
FROM ghcr.io/cryptaliagy/httpget:latest as httpget

# Use a minimal distroless image as the final base to reduce attack surface
FROM gcr.io/distroless/base as runner

# Set up the working directory for the application
WORKDIR /app

# Copy the httpget utility from its build stage
COPY --from=httpget /httpget /httpget

# Copy application artifacts from build stage:
# - Compiled backend binary
# - Static public assets
COPY --from=build /app/server server
COPY --from=build /app/services/backend/public public

# Configure production environment
ENV NODE_ENV=production

# Command to start the backend server
CMD ["./server"]

# Make the application port available
EXPOSE 3000

# Configure healthcheck to monitor application status
# Runs every 30s with 30s timeout and 3 retries after 5s startup period
HEALTHCHECK --interval=30s --timeout=10s --start-period=2s --retries=3 CMD ["/httpget", "http://localhost:3000/api/health"]
