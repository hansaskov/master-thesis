# Use Bun (JavaScript runtime) image as the base
FROM oven/bun:1 AS build

# Set the working directory to /app inside the container
WORKDIR /app

# Copy necessary package files to install dependencies
COPY bun.lockb package.json /app/
COPY /packages/backend/package.json /app/packages/backend/
COPY /packages/frontend/package.json /app/packages/frontend/

# Install dependencies using Bun
RUN bun install

# Copy the backend source code into the container
COPY /packages/backend /app/packages/backend

# Move directory to frontend
WORKDIR /app/packages/backend

# Start the backend server in watch mode for development
CMD ["bun", "--watch", "./src/index.ts"]

# Expose port 3000 for the development server
EXPOSE 3000