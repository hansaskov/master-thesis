# Set the source directory to the directory containing this script
$SOURCE_DIR = Split-Path -Parent $MyInvocation.MyCommand.Definition

# Set the destination IP and user to use with ssh and scp
$DEST_USER = "root"
$DEST_IP = "188.245.145.180"

# Set the destination directory
$DEST_DIR = "/etc/nixos"

$FILE_1 = "admin-password-hash"
$FILE_2 = "ssh-keys"

# Use scp to copy the files to the remote server
& scp "$SOURCE_DIR\$FILE_1" "${DEST_USER}@${DEST_IP}:$DEST_DIR/$FILE_1"
& scp "$SOURCE_DIR\$FILE_2" "${DEST_USER}@${DEST_IP}:$DEST_DIR/$FILE_2"

# Will set the permissions such that only the root user can read and write the file
& ssh "${DEST_USER}@${DEST_IP}" "chmod 600 $DEST_DIR/$FILE_1"