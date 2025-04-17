#!/bin/bash
#
# NixOS Server Provisioner
# ------------------------
# This script creates a new server on Hetzner Cloud and installs NixOS using nixos-infect.
# It waits for the installation to complete or times out after 5 minutes.
#
# Usage:
# ./script.sh [server-name] [ssh-key] [password-hash] [type] [location]
#
# Arguments:
# server-name: Optional. Name for the server (default: nixos)
# ssh-key: Optional. Name of the ssh-key registered in Hetzner Cloud (default: deploy-key)
# password-hash: Required. NixOS password hash for admin user
# type: Optional. Server type (default: cx22)
# location: Optional. Hetzner location (default: fsn1)
#
# Requirements:
# - hcloud CLI tool configured with API token
#
# Author: Hans Askov
# Version: 2.1
set -e

# Configuration
SERVER_NAME=${1:-"nixos"}
SSH_KEY=${2:-"deploy-key"}
PASSWORD_HASH="${3}"
TYPE=${4:-"cx22"}
LOCATION=${5:-"fsn1"}

# Check if the password hash is provided
if [ -z "${PASSWORD_HASH}" ] ; then
  echo "❌ Error: PASSWORD_HASH argument not provided"
  echo "Usage: $0 [server-name] [ssh-key] [password-hash] [type] [location]"
  exit 1
fi

# Get SSH public key from Hetzner
SSH_PUBLIC_KEYS=$(hcloud ssh-key describe "$SSH_KEY" -o format='{{.PublicKey}}')

# Verify SSH public key is set and valid
if [ -z "${SSH_PUBLIC_KEYS}" ] ; then
  echo "❌ Error: SSH public key was not fetched correctly"
  exit 1
fi

# Validate SSH public key format
if ! [[ "$SSH_PUBLIC_KEYS" =~ ^(ssh-rsa|ssh-ed25519|ecdsa-sha2-nistp256|ecdsa-sha2-nistp384|ecdsa-sha2-nistp521|sk-ecdsa-sha2-nistp256@openssh.com|sk-ssh-ed25519@openssh.com)\ [A-Za-z0-9+/]+[=]{0,3}(\ .*)?$ ]]; then
  echo "❌ Error: SSH public key appears to be in an invalid format"
  echo " • Got: ${SSH_PUBLIC_KEYS:0:40}..."
  exit 1
fi

# Display settings information
echo "🔧 Configuration settings:"
echo " • Server Name: $SERVER_NAME"
echo " • SSH Key: $SSH_KEY"
echo " • Password Hash: ${PASSWORD_HASH:0:20}... (truncated)"
echo " • Server Type: $TYPE"
echo " • Location: $LOCATION"
echo " • SSH Public Key: ${SSH_PUBLIC_KEYS:0:40}... (truncated)"
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
--type "$TYPE" \
--image "ubuntu-22.04" \
--location "$LOCATION" \
--ssh-key "$SSH_KEY" \
--user-data-from-file cloud-init.yaml \
--start-after-create

# Get IP and cleanup
SERVER_IP=$(hcloud server describe "$SERVER_NAME" -o format='{{.PublicNet.IPv4.IP}}')
rm cloud-init.yaml
echo "✅ Server created! IP: $SERVER_IP"
echo "⏳ NixOS installation in progress (~5 minutes)"

# Wait for NixOS with 5 min timeout
end=$((SECONDS + 450))
while [ $SECONDS -lt $end ]; do
  if ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "root@${SERVER_IP}" "systemctl is-system-running" >/dev/null 2>&1; then
    echo "🔄 Updating NixOS configuration..."
    # Call remote-update.sh with all necessary parameters
    bash ./remote-update.sh "$SERVER_IP" "$SSH_PUBLIC_KEYS" "$PASSWORD_HASH"
    echo "🎉 NixOS ready! Connect with: ssh root@$SERVER_IP or admin@$SERVER_IP"
    exit 0
  fi
  echo "⏳ Waiting 30s... (${SECONDS}s/${end})"
  sleep 30
done
echo "❌ Timeout reached. Check manually: ssh root@$SERVER_IP"
exit 1