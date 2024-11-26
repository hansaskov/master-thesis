# TriVision Production System Monitoring

## Introduction

This project aims to develop a comprehensive web-based system for TriVision to enhance their ability to monitor, maintain, and service production systems in the food industry. The solution addresses the lack of insight into production systems and enables scheduled maintenance based on actual system usage and performance metrics. By collecting data metrics from production systems, visualizing them through a web interface, the system provides a complete solution for TriVision's needs.

## Technologies Used

The backend of this project is built using Elysia, Drizzle and TimescaleDB. These technologies provide a robust and efficient foundation for handling data processing and API interactions. The frontend is developed with SvelteKit, Tailwind CSS and Shadcn-svelte, offering a modern and responsive user interface.

For infrastructure, the project utilizes Docker for containerization, Caddy as a reverse proxy, and TimescaleDB for efficient time-series data storage.

## Project Overview

The project consists of several key components working together to provide a comprehensive monitoring solution. A Windows application collects metrics from production systems via UPC-UA, PCs, and cameras. This data is then sent to an ingestion server using gRPC, which forwards it to the backend server for processing and storage in TimescaleDB.

The frontend application provides a user-friendly interface for visualizing data and managing service appointments. It communicates with the backend through a RESTful API. The entire system is designed to be, secure, and optionally self-hostable by customers within their local area network (LAN).

A reverse proxy handles routing and SSL termination, ensuring secure communication between different components of the system.

## Getting Started

To get the project up and running, follow these steps:

### 1. Prerequisites
Make sure you have the following installed:
- [Docker](https://docs.docker.com/get-started/get-docker/)
- [Bun](https://bun.sh/)

### 2. Download the Project

Then you'll need to clone the repository.

```bash
git clone https://github.com/hansaskov/master-thesis
cd master-thesis
```

### 3. Install the Dependencies
This project uses a monorepo structure, running `bun install` will install all the dependencies, for both the backend and frontend. Make sure this is run from the root of the project.
```bash
bun install
```
### 4. Create the `.env` File

You need to set up environment variables for the project. These values help configure things like which domain to serve the app on. 

```bash
cp .env.example .env
```

- **`cp .env.example .env`**: This copies the example `.env` file into a new `.env` file, which you can then edit to fill in your own values.


## Running the Project

### Development Mode

If you're working on the project locally and want to see live changes as you work, use the following command:

```bash
docker compose up --build --watch
```

Let's break down this command:

- **`docker compose up`**: This starts all the services defined in the `docker-compose.yaml` file (like the backend API, frontend, or database) and keeps them running.
  
- **`--build`**: This flag forces Docker to rebuild the images for your services (both backend and frontend) before starting them. This ensures that you're working with the most up-to-date version of your code.

- **`--watch`**: This enables "hot reloading" in development mode. Docker will automatically watch your files for changes and rebuild/restart the services as needed, so you don't have to manually restart the project after each change.

Once the command is running, the project will be available at:
- [http://localhost:3000](http://localhost:3000) if no custom domain is set, or
- The domain specified by `APP_FQDN` in your `.env` file.

### Production Mode

When you're ready to deploy the project for real (in a production environment), use this command:

```bash
docker compose -f compose.yaml up --build -d
```

Let’s break down each part:

- **`docker compose -f compose.yaml`**: Same as the previous example, but now we exclute the compose.override.yaml file, which was used to define a local development environment.

- **`up`**: This starts all the services just like in development mode.

- **`--build`**: Similar to the development mode, this flag forces Docker to rebuild all the images.

- **`-d`**: The `-d` stands for "detached mode." This means Docker will run the services in the background. Once the services are up and running, you can safely close your terminal, and the services will continue to run.

> **Note**: Production mode is set to work only on these standard ports (80 and 443). This is typical for web servers, ensuring compatibility with browsers and users’ requests over HTTP/HTTPS.

