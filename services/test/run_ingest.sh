#!/bin/bash

# Download the binary and make it executable
wget -q https://github.com/hansaskov/master-thesis/releases/download/1.1.0/ingest -O ingest && \
chmod +x ingest && \
./ingest -h