#!/bin/bash
# remote-update.sh - Updates NixOS configuration on a remote server
#
# Usage: ./remote-update.sh SERVER_IP SSH_PUBLIC_KEYS PASSWORD_HASH
#
# Arguments:
#   SERVER_IP: IP address of the NixOS server
#   SSH_PUBLIC_KEYS: Public SSH key(s) to install on the server
#   PASSWORD_HASH: Hashed password for the admin user
#
set -e

# Set the destination IP and user from arguments
SERVER_IP="${1}"
SSH_PUBLIC_KEYS="${2}"
PASSWORD_HASH="${3}"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST_DIR="/etc/nixos"
USER="root"
FILE="configuration.nix"

# Check if all required parameters are provided
if [ -z "${SERVER_IP}" ]; then
  echo "❌ Error: SERVER_IP argument not provided"
  echo "Usage: $0 SERVER_IP SSH_PUBLIC_KEYS PASSWORD_HASH"
  exit 1
fi

if [ -z "${SSH_PUBLIC_KEYS}" ]; then
  echo "❌ Error: SSH_PUBLIC_KEYS argument not provided"
  echo "Usage: $0 SERVER_IP SSH_PUBLIC_KEYS PASSWORD_HASH"
  exit 1
fi

if [ -z "${PASSWORD_HASH}" ]; then
  echo "❌ Error: PASSWORD_HASH argument not provided"
  echo "Usage: $0 SERVER_IP SSH_PUBLIC_KEYS PASSWORD_HASH"
  exit 1
fi

# Display settings information
echo "🔧 Configuration settings:"
echo " • Server IP: $SERVER_IP"
echo " • Password Hash: ${PASSWORD_HASH:0:20}... (truncated)"
echo " • SSH Public Key: ${SSH_PUBLIC_KEYS:0:40}... (truncated)"
echo ""

echo "🔍 Checking connection to ${SERVER_IP}..."

# Remove existing SSH host key if it exists
echo "🔑 Updating SSH known hosts..."
ssh-keygen -f "${HOME}/.ssh/known_hosts" -R "${SERVER_IP}" 2>/dev/null || true

# Define SSH options to bypass host key checking
SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"

echo "📝 Transferring password hash file..."
ssh ${SSH_OPTS} "${USER}@${SERVER_IP}" "echo '${PASSWORD_HASH}' > ${DEST_DIR}/admin-password-hash"

echo "🔑 Transferring SSH keys file..."
ssh ${SSH_OPTS} "${USER}@${SERVER_IP}" "echo '${SSH_PUBLIC_KEYS}' > ${DEST_DIR}/ssh-keys"

echo "🔒 Transferring file permissions..."
ssh ${SSH_OPTS} "${USER}@${SERVER_IP}" "chmod 600 ${DEST_DIR}/admin-password-hash ${DEST_DIR}/ssh-keys"

echo "📤 Copying configuration..."
scp ${SSH_OPTS} "${SOURCE_DIR}/${FILE}" "${USER}@${SERVER_IP}:${DEST_DIR}/${FILE}"

echo "🔄 Rebuilding NixOS..."
ssh ${SSH_OPTS} "${USER}@${SERVER_IP}" "nixos-rebuild switch"

echo "✅ Update completed successfully!"