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
    domain = ""; # It can be left empty if it is auto-detected through DHCP.
    firewall = {
      enable = true;
      allowedTCPPorts = [ 22 80 443 ]; # SSH, HTTP, HTTPS, BACKEND
    };
  };
  
  # SSH Configuration
  services.openssh = {
    enable = true;
    settings = {
      PasswordAuthentication = false;       # Disable password authentication
      AllowUsers = [ "admin" ];      # Allow only root and admin users to log in via SSH
    };
  };
 
  # Users can only be defined in the config file
  users.mutableUsers = false;

  # Root user configuration 
  # WARING: REMOVE THIS CODE TO HARDEN SECURITY
  # users.users.root.openssh.authorizedKeys.keyFiles = [ sshKeysPath ];  # Use the external file for root's SSH keys
  
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
    docker
  ];
  
  # Docker Configuration
  virtualisation.docker.enable = true;
  
  # System Configuration
  system = {
    stateVersion = "24.11";   # Target NixOS version
    autoUpgrade = {
      enable = true;          # Enable automatic upgrades
    };
  };
}
