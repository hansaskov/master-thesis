# TriVision Production System Monitoring

## Introduction

This project aims to develop a comprehensive web-based system for TriVision to enhance their ability to monitor, maintain, and service production systems in the food industry. The solution addresses the lack of insight into production systems and enables scheduled maintenance based on actual system usage and performance metrics. By collecting data metrics from production systems, visualizing them through a web interface, the system provides a complete solution for TriVision's needs.

## Technologies Used

The backend of this project is built using Rust, Bun, Drizzle, TimescaleDB. These technologies provide a robust and efficient foundation for handling data processing and API interactions. The frontend is developed with Bun, SvelteKit, Tailwind CSS, and Shadcn-svelte, offering a modern and responsive user interface.

For infrastructure, the project utilizes Docker for containerization, Caddy as a reverse proxy, and TimescaleDB for efficient time-series data storage. Data collection from production systems is facilitated through gRPC, ensuring fast and reliable communication.

## Project Overview

The project consists of several key components working together to provide a comprehensive monitoring solution. A Windows application collects metrics from production systems via UPC-UA, PCs, and cameras. This data is then sent to an ingestion server using gRPC, which forwards it to the backend server for processing and storage in TimescaleDB.

The frontend application provides a user-friendly interface for visualizing data and managing service appointments. It communicates with the backend through a RESTful API. The entire system is designed to be, secure, and optionally self-hostable by customers within their local area network (LAN).

A reverse proxy handles routing and SSL termination, ensuring secure communication between different components of the system.

## Getting Started

To run the project using Docker Compose, follow these steps:

1. Ensure you have Docker and Docker Compose installed on your system.
2. Clone the repository to your local machine.
3. Navigate to the root directory of the project.
4. Run the following command to start all services:

   ```
   docker compose up -d --build
   ```

5. Once the services are up and running, you can access the frontend application through your web browser. at [http://caddy.localhost](http://caddy.localhost).

This setup will launch all necessary services, including the backend server, frontend application, database, and reverse proxy. The system will be ready for data collection and visualization.
