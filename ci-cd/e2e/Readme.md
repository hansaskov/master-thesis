# End-to-End Testing

This directory contains the end-to-end testing suite for the TriVision Production System Monitoring project.

## Installation

Before running the tests, ensure you have the following dependencies installed:

- Bun
- Docker

1. Start by installing the dependencies using the following command:
```	bash 
bun install
```

2. Also install the headless browser drivers for your operating system:
``` bash
bunx playwright install
``` 

## Running the Tests

To run the tests you must first start the project. This can be done using docker and docker compose in the root of the project.

1. (optional) If you haven't already, start the project using docker compose:
``` bash
docker compose up -d --build
```

2. Once the project is up and running, you can run the tests using the following command:
``` bash
bunx playwright test
```

## Writing Tests

To learn more about how to write tests, please refer to the official Playwright documentation: [https://playwright.dev/docs/intro](https://playwright.dev/docs/intro)

