{ pkgs, ... }:
let
  adminPasswordFile = "/etc/nixos/admin-password-hash";
  sshKeysPath = "/etc/nixos/ssh-keys"; 
in
{
  imports = [
    ./hardware-configuration.nix
    ./networking.nix # generated at runtime by nixos-infect
  ];
  
  # Boot Configuration
  boot.tmp.cleanOnBoot = true;
  zramSwap.enable = true;
  
  # Networking Configuration
  networking = {
    hostName = "nixos";
    domain = "";
    firewall = {
      enable = true;
      allowedTCPPorts = [ 22 80 443 ]; # SSH, HTTP, HTTPS
    };
  };
  
  # SSH Configuration
  services.openssh = {
    enable = true;
    settings = {
      PermitRootLogin = "prohibit-password"; # Root login via SSH key only
      PasswordAuthentication = false;       # Disable password authentication
      X11Forwarding = false;
      MaxAuthTries = 3;                     # Limit authentication attempts
      LoginGraceTime = 60;                  # Grace period for login (in seconds)
      AllowUsers = [ "root" "admin" ];      # Allow only root and admin users to log in via SSH
    };
  };
 
  # Users can only be defined in the config file
  users.mutableUsers = false;

  # Root user configuration 
  # WARING: REMOVE THIS CODE TO HARDEN SECURITY
  users.users.root.openssh.authorizedKeys.keyFiles = [ sshKeysPath ];  # Use the external file for root's SSH keys
  
  # Admin user configuration
  users.users.admin = {
    isNormalUser = true;
    extraGroups = [ "wheel" "docker" ];  # Admin is part of the sudo (wheel) and Docker groups
    openssh.authorizedKeys.keyFiles = [ sshKeysPath ];  # Use the external file for admin's SSH keys
    hashedPasswordFile = adminPasswordFile;             # Use external file for the admin's password hash
  };
  
  # Require password for sudo access
  security.sudo.wheelNeedsPassword = true;
  
  # Software Packages
  environment.systemPackages = with pkgs; [
    git
    docker
  ];
  
  # Docker Configuration
  virtualisation.docker.enable = true;
  
  # System Configuration
  system = {
    stateVersion = "24.05";   # Target NixOS version
    autoUpgrade = {
      enable = true;          # Enable automatic upgrades
      allowReboot = false;    # Do not allow automatic reboots
    };
  };
}
