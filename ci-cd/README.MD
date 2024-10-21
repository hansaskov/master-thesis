# CI-CD 

## Common commands
This section is a collection of common commands that are used in this document. like creating ssh keys, admin passwords, etc.
### Create ssh key
``` bash
ssh-keygen -t rsa -b 4096
```

### Create admin password (wsl)
``` bash
wsl mkpasswd
```

## Deploy services to hetzner. 
This section will guide you through the process of deploying the services to hetzner. First you will create an account, then start a new project, and finally add a server resource. You need to set the following parameters for the server resource. 

- Location: one near your. (i will choose Falkenstein). 
- Image: Ubuntu 22.04, but will change it to nixos. 
- Resource: I will choose the lowest resource possible of a CX22 intel processor with 2 cores and 4 Gib of memory. 
- SSH-key: You must insert your public ssh key. You can generate one by writing `ssh-keygen` in the terminal. Then find the public key under ~/.ssh/id_rsa.pub and paste it into the hetzner ssh key. 
- Volumes: empty 
- Firewalls: empty
- Backups: empty 
- Placement groups: empty 
- Labels: empty 
- Cloud config: See below

This will run [nixos infect](https://github.com/elitak/nixos-infect?tab=readme-ov-file#hetzner-cloud). It will change the distrobution from ubuntu to nixos. Please be patient for the transition as it can take up to 5 minutes depending on the hardware. 
``` yaml
#cloud-config
runcmd:
  - curl https://raw.githubusercontent.com/elitak/nixos-infect/master/nixos-infect | PROVIDER=hetznercloud NIX_CHANNEL=nixos-24.05 bash 2>&1 | tee /tmp/infect.log 
```



You can check when it has finished by going under the graph tab in hetzner and see when the cpu reaches close to 0% utilization. 

In the next step you will update the default configuration.nix file to one that hardens the security in the following ways. 

1. Enable firewall only on port 20, 80 and 443. 
2. Use ssh-keys for accessing the server
3. create a password for the admin user.
4. Use a minimal amount of external packages (docker & git)

Before we access the server we need to update the configuration for our ssh-keys and admin password. To start first go into the [ssh-keys](./nixos/ssh-keys%20copy) file and insert your ssh keys and then rename the file to `ssh-keys` . these will allow you to access the root and admin user. The file should look like this.

``` bash
# ssh-keys
ssh-rsa AAAAB3Nz........
```
IMPORTANT: double check that the ssh keys have been set correctly. An incorrect insertion will lock you out of your server. 


Next go into the [admin-password-hash](./nixos/admin-password-hash%20copy) file and insert your admin password. This will be used to authenticate yourself with the server. The file should look like this.

``` bash
# admin-password-hash
$5$r......  # sha-512 hash
```

To update the server with the new configuration you will need to open `./nixos/remote-update-ssh.ps1` and `ci-cd\nixos\remote-rebuild.ps1`, then change the ip address to the ip address of your server.

Then run `./nixos/remote-update.ps1` the script will copy [ssh-keys](ci-cd\nixos\ssh-keys.nix) and [admin-password-hash](ci-cd\nixos\admin-password-hash)  into `/etc/nixos` on your server. Then it will set the permissions of the admin-password-hash file to only allow the root to read and write.  

Then run `ci-cd\nixos\remote-rebuild.ps1` it will copy over the configuration.nix file and rebuild the configuration. 

When the build has finished you should be able to login to the admin user via ssh. 
```
ssh admin@<server-ip>
```

When you are ready to harden down the security of the server even more, then you can remove ssh to the root user entirely, which will make it more secure in the case of a compromise.
``` nix
  # Root user configuration 
  # WARING: REMOVE THIS CODE TO HARDEN SECURITY
  users.users.root.openssh.authorizedKeys.keyFiles = [ sshKeysPath ];  # Use the external file for root's SSH keys
```


