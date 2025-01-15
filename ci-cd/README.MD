# DEBRICATED

#  Continuous Integration and Continuous Deployment (CI/CD)



Welcome to the guide on deploying services using CI/CD. This guide walks you through key steps such as generating SSH keys, setting up Hetzner servers, and configuring NixOS for deployment. Follow along to simplify and automate the deployment process.

---

## Common Commands

In this section, we’ll go over some common commands that you'll need throughout this guide—like generating SSH keys and creating admin passwords.

### Generating an SSH Key

SSH (Secure Shell) keys are used to securely connect to your server. To generate an SSH key, run the following command in your terminal:

```bash
ssh-keygen -t rsa -b 4096
```

This creates a 4096-bit RSA key pair, providing you with a secure way to connect to your server.

### Creating an Admin Password (WSL)

If you're using Windows Subsystem for Linux (WSL), you can generate an admin password by using this command:

```bash
wsl mkpasswd
```

This will output a password hash, which you can use for server authentication later in the guide.

---

## Deploying Services to Hetzner

This section will guide you through deploying services on Hetzner Cloud. We will start by creating a project, setting up a server, and switching its operating system from Ubuntu to NixOS.

### Setting Up Your Hetzner Server

1. **Create an Account**: Start by signing up for a Hetzner account if you don't already have one.
2. **Create a New Project**: After logging in, create a new project.
3. **Add a Server Resource**: Inside your project, add a server with the following configuration:

   - **Location**: Choose one near your physical location (for example, Falkenstein).
   - **Image**: Select Ubuntu 22.04, but we will later switch to NixOS.
   - **Resources**: Opt for a minimal configuration like a CX22 with 2 cores and 4 GB of memory.
   - **SSH Key**: Paste your public SSH key here. If you haven't generated one yet, follow the steps in the [SSH Key section](#generating-an-ssh-key).
   - **Volumes, Firewalls, Backups, Placement Groups, Labels**: Leave all of these empty or at their default settings.
   - **Cloud config**: See instructions below.

### Switching from Ubuntu to NixOS

We’ll use a tool called [nixos-infect](https://github.com/elitak/nixos-infect) to replace Ubuntu with NixOS. This process may take up to 5 minutes, depending on your server’s performance.

Add the following Cloud Config to run nixos-infect:

```yaml
#cloud-config
runcmd:
  - curl https://raw.githubusercontent.com/elitak/nixos-infect/master/nixos-infect | PROVIDER=hetznercloud NIX_CHANNEL=nixos-24.05 bash 2>&1 | tee /tmp/infect.log
```

You can check the progress by viewing the CPU utilization graph in Hetzner's dashboard. Once the CPU usage drops close to 0%, the process should be complete.

---

## Configuring NixOS

After the transition to NixOS is complete, we’ll modify the default configuration to enhance security. Follow these steps to update `configuration.nix` with security-focused settings:

1. **Enable a Firewall**: Allow only ports 20, 80, and 443 (for FTP, HTTP, and HTTPS traffic).
2. **SSH Key Authentication**: Ensure only SSH key-based authentication is allowed.
3. **Admin User**: Set up an admin user with a secure password.
4. **Minimal External Packages**: Install only essential packages like Docker and Git.

### Updating SSH Keys and Admin Password

Before proceeding, ensure that the correct SSH keys and admin password are configured.

1. **SSH Keys**: Open the [ssh-keys file](./nixos/copy.ssh-keys), add your public SSH keys, and rename the file to `ssh-keys`. It should look like this:

   ```bash
   # ssh-keys
   ssh-rsa AAAAB3Nz........
   ```

   **Important**: Verify that the keys are correctly inserted to avoid being locked out of your server.

2. **Admin Password**: Open the [admin-password-hash file](./nixos/copy.admin-password-hash) and insert your hashed admin password (SHA-512 hash). The file should look like this:

   ```bash
   # admin-password-hash
   $5$r......  # SHA-512 hash
   ```

### Updating the Server Configuration

To update the server configuration with these new settings, follow these steps:

1. Modify the IP address in the [ci-cd/nixos/remote-update.ps1](./nixos/remote-update.ps1) and [ci-cd/nixos/remote-rebuild.ps1](./nixos/remote-rebuild.ps1) scripts to match your server’s IP.
2. Run the `remote-update.ps1` script. It will upload the SSH keys and admin password to your server, and to set the correct permissions for the `admin-password-hash` file.
``` bash
./ci-cd/nixos/remote-update.ps1
```
3. Run `remote-rebuild.ps1` to upload the `configuration.nix` file and rebuild the system configuration.
``` bash
./ci-cd/nixos/remote-rebuild.ps1
```

Once the rebuild is complete, you can log in to the server as the admin user:

```bash
ssh admin@<server-ip>
```

### Hardening Security

After you’ve confirmed access to the admin user, you can further secure your server by disabling SSH access for the root user. This prevents anyone from logging in as root, adding an extra layer of protection.

In your `configuration.nix`, find the root user SSH configuration and remove it:

```nix
# Root user configuration 
# WARNING: REMOVE THIS CODE TO HARDEN SECURITY
users.users.root.openssh.authorizedKeys.keyFiles = [ sshKeysPath ];  # Use the external file for root's SSH keys
```

---

## Running Docker on the Server

Now that your server is ready, you can start Docker containers remotely. Set the `DOCKER_HOST` to the server’s IP address and use Docker Compose to launch your services.

In PowerShell, run:

```powershell
$env:DOCKER_HOST = "ssh://admin@<server-ip>"                                                  
docker compose --env-file .\.env.production up -d --build
```

This command will build and start the containers defined in your `docker-compose` file on the remote server.

---

That’s it! You’ve now set up a secure Hetzner server running NixOS, deployed your services using Docker, and locked down security to prevent unauthorized access. Feel free to tweak configurations or reach out for further clarification!