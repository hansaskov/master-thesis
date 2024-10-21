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
  
  # Networking
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
      PermitRootLogin = "prohibit-password";
      PasswordAuthentication = false;
      X11Forwarding = false;
      MaxAuthTries = 3;
      LoginGraceTime = 60;
    };
    extraConfig = "AllowUsers root admin";
  };
 
  # Users can only be defined in the config file
  users.mutableUsers = false;
  
  # Root user configuration WARNING. Remove this to harden the security but make it more difficult to update the config
  users.users.root.openssh.authorizedKeys.keyFiles = [ sshKeysPath ];  # Use the external file for root
  
  # Admin user Configuration
  users.users.admin = {
    isNormalUser = true;
    extraGroups = [ "wheel" "docker" ];
    openssh.authorizedKeys.keyFiles = [ sshKeysPath ];  # Use the external file for admin
    hashedPasswordFile = adminPasswordFile;
  };
  
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
    stateVersion = "24.05";
    autoUpgrade = {
      enable = true;
      allowReboot = false;
    };
  };
}
