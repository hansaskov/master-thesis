# CI-CD 

## Deploy services to hetzner. 

1. Create an account
2. Start a new project
3. Add a server resource 
4. 

- Location: one near your. (i will choose Falkenstein). 
- Image: Ubuntu, but will change it to nixos. 
- Resource: I will choose the lowest resource possible of a CX22 intel processor with 2 cores and 4 Gib of memory. 
- SSH-key: You must insert your public ssh key. You can generate one by writing `ssh-keygen` in the terminal. Then find the public key under ~/.ssh/id_rsa.pub and paste it into the hetzner ssh key. 
- Volumes: empty 
- Firewalls: empty
- Backups: empty 
- Placement groups: empty 
- Labels: empty 
- Cloud config: add the following

``` yaml
#cloud-config

runcmd:
  - curl https://raw.githubusercontent.com/elitak/nixos-infect/master/nixos-infect | PROVIDER=hetznercloud NIX_CHANNEL=nixos-23.05 bash 2>&1 | tee /tmp/infect.log
```

This will run [nixos infect](https://github.com/elitak/nixos-infect?tab=readme-ov-file#hetzner-cloud). It will change the distrobution from ubuntu to nixos. Please be patient for the transition as it can take up to 5 minutes depending on the hardware. 

You can check when it has finished by going under the graph tab in hetzner and see when the cpu reaches close to 0% utilization. 

In the next step you will update the default configuration.nix file to one that hardens the security in the following ways. 

1. Enable firewall only on port 20, 80 and 443. 
2. Use ssh-keys instead of password authentication. 
3. create admin user with password credentials instead of root
4. Use a minimal amount of external packages (docker & git)

First go into the [ssh-keys.nix](ci-cd\nixos\ssh-keys.nix) document and insert your ssh keys. These will be used to authenticate yourself with the server. 

IMPORTANT: double check that the ssh keys have been set correctly. An incorrect insertion will lock you out of your server. 

Before staring off you should open `./nixos/remote-update-ssh.ps1` and `ci-cd\nixos\remote-rebuild.ps1`, then change the ip address to the ip address of your server. 

You next 

Then run `./nixos/remote-update-ssh.ps1` the script will copy the [ssh-keys.nix](ci-cd\nixos\ssh-keys.nix) and [admin-password-hash](ci-cd\nixos\admin-password-hash)  into `/etc/nixos` on your server. Then it will set the permissions of the admin-password-hash file to only allow the root to read and write.  

Then run `ci-cd\nixos\remote-rebuild.ps1` it will copy over the configuration.nix file and rebuild the configuration. 

When the build has finished you should be able to login to the admin user via ssh. 


