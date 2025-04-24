#!/bin/bash

# Get the upload key from the command line argument, or use a default
UPLOAD_KEY="${1}"

# Create config.toml with the upload key
cat > config.toml << EOL
[upload]
url = "https://preview.master-thesis.hjemmet.net/api/readings"
key = "${UPLOAD_KEY}"
[docker]
EOL

# Download the binary and make it executable
wget -q https://github.com/hansaskov/master-thesis/releases/download/1.1.0/ingest -O ingest && \
chmod +x ingest && \
./ingest &