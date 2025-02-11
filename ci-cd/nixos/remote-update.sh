#!/bin/bash
set -e

# Set the destination IP and user to use with ssh
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST_DIR="/etc/nixos"
USER="root"
FILE="configuration.nix"

# Check if the environment variables are set
if [ -z "${SSH_KEYS}" ] || [ -z "${PASSWORD_HASH}" ] || [ -z "${SERVER_IP}"  ]; then
  echo "❌ Error: SSH_KEYS, PASSWORD_HASH or SERVER_IP environment variables not defined"
  exit 1
fi

echo "🔍 Checking connection to ${SERVER_IP}..."

echo "📝 Transferring password hash file..."
ssh "${USER}@${SERVER_IP}" "echo '${PASSWORD_HASH}' > ${DEST_DIR}/admin-password-hash"

echo "🔑 Transferring SSH keys file..."
ssh "${USER}@${SERVER_IP}" "echo '${SSH_KEYS}' > ${DEST_DIR}/ssh-keys"

echo "🔒 Transferring file permissions..."
ssh "${USER}@${SERVER_IP}" "chmod 600 ${DEST_DIR}/admin-password-hash ${DEST_DIR}/ssh-keys"

echo "📤 Copying configuration..."
scp "${SOURCE_DIR}/${FILE}" "${USER}@${SERVER_IP}:${DEST_DIR}/${FILE}"

echo "🔄 Rebuilding NixOS..."
ssh "${USER}@${SERVER_IP}" "nixos-rebuild switch"

echo "✅ Update completed successfully!"