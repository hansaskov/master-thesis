#!/bin/bash
set -e
# Set the destination IP and user to use with ssh
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST_DIR="/etc/nixos"
USER="root"
FILE="configuration.nix"

# Check each environment variable individually
if [ -z "${SSH_PUBLIC_KEYS}" ]; then
  echo "❌ Error: SSH_PUBLIC_KEYS environment variable not defined"
  exit 1
fi
if [ -z "${PASSWORD_HASH}" ]; then
  echo "❌ Error: PASSWORD_HASH environment variable not defined"
  exit 1
fi
if [ -z "${SERVER_IP}" ]; then
  echo "❌ Error: SERVER_IP environment variable not defined"
  exit 1
fi

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