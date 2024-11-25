# Use Bun (JavaScript runtime) image as the base
FROM oven/bun:1 AS build

# Set the working directory to /app inside the container
WORKDIR /app

# Copy necessary package files to install dependencies
COPY bun.lockb package.json /app/
COPY /packages/backend/package.json /app/packages/backend/
COPY /packages/frontend/package.json /app/packages/frontend/

# Install dependencies
RUN bun install

# Copy the rest of your app's source code
COPY /packages/frontend ./packages/frontend

# Move directory to frontend
WORKDIR /app/packages/frontend

# Build your app
RUN bun run build

CMD ["bunx", "vite", "dev"]

EXPOSE 5173