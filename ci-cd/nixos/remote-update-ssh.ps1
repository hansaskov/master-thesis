# Set the source directory to the directory containing this script
$SOURCE_DIR = Split-Path -Parent $MyInvocation.MyCommand.Definition

# Set the destination IP and user to use with ssh and scp
$DEST_USER = "root"
$DEST_IP = "188.245.160.211"

# Set the destination directory
$DEST_DIR = "/etc/nixos"

$FILE_1 = "ssh-keys.nix"

# Use scp to copy the files to the remote server
& scp "$SOURCE_DIR\$FILE_1" "${DEST_USER}@${DEST_IP}:$DEST_DIR/$FILE_1"