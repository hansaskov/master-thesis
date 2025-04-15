#!/bin/bash
#
# NixOS Server Provisioner
# ------------------------
# This script creates a new server on Hetzner Cloud and installs NixOS using nixos-infect.
# It waits for the installation to complete or times out after 5 minutes.
#
# Usage:
#   ./script.sh [server-name] [ssh-key]
#
# Arguments:
#   server-name: Optional. Name for the server (default: nixos)
#   ssh-key: Optional. Name of the ssh-key registered in Hetzner Cloud
#
# Requirements:
#   - hcloud CLI tool configured with API token
#   - password hash
#
# Author: Hans Askov
# Version: 1.0

set -e

# Check if the environment variables are set
if [ -z "${PASSWORD_HASH}" ] ; then
  echo "❌ Error: PASSWORD_HASH environment variables not defined"
  exit 1
fi

# Configuration
SERVER_NAME=${1:-"nixos"}
SSH_KEY=${2:-"deploy-key"}
export SSH_PUBLIC_KEYS=${3:-$(hcloud ssh-key describe $SSH_KEY -o format='{{.PublicKey}}')}

# Display settings information
echo "🔧 Configuration settings:"
echo "  • Server Name: $SERVER_NAME"
echo "  • SSH Key: $SSH_KEY"
echo "  • SSH Public Key: ${SSH_PUBLIC_KEYS:0:40}... (truncated)"
echo ""

echo "🚀 Creating NixOS server: $SERVER_NAME"

# Create cloud-init config
cat > cloud-init.yaml << EOF
#cloud-config
runcmd:
  - curl https://raw.githubusercontent.com/elitak/nixos-infect/master/nixos-infect | PROVIDER=hetznercloud NIX_CHANNEL=nixos-24.11 bash 2>&1 | tee /tmp/infect.log
packages:
  - curl
EOF

# Create server
echo "🛠️ Provisioning server..."
hcloud server create \
    --name "$SERVER_NAME" \
    --type "cx22" \
    --image "ubuntu-22.04" \
    --location "fsn1" \
    --ssh-key "$SSH_KEY" \
    --user-data-from-file cloud-init.yaml \
    --start-after-create

# Get IP and cleanup
export SERVER_IP=$(hcloud server describe "$SERVER_NAME" -o format='{{.PublicNet.IPv4.IP}}')
rm cloud-init.yaml

echo "✅ Server created! IP: $SERVER_IP"
echo "⏳ NixOS installation in progress (~5 minutes)"

# Wait for NixOS with 5 min timeout
end=$((SECONDS + 300))
while [ $SECONDS -lt $end ]; do
    if ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "root@${SERVER_IP}" "systemctl is-system-running" >/dev/null 2>&1; then
        echo "🔄 Updating NixOS configuration..."
        bash ./remote-update.sh
        echo "🎉 NixOS ready! Connect with: ssh root@$SERVER_IP or admin@$SERVER_IP" 
        exit 0
    fi
    echo "⏳ Waiting 30s... (${SECONDS}s/${end})"
    sleep 30
done

echo "❌ Timeout reached. Check manually: ssh root@$SERVER_IP"
exit 1