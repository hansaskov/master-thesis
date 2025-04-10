from __future__ import annotations

import os
import time
import subprocess
import json
import threading
import requests
from datetime import datetime, timezone

from hcloud import Client
from hcloud.images import Image
from hcloud.server_types import ServerType
from hcloud.servers import Server
from hcloud.volumes import Volume

assert "HCLOUD_TOKEN" in os.environ, "Please export your API token in the HCLOUD_TOKEN environment variable"
token = os.environ["HCLOUD_TOKEN"]

client = Client(token=token)

user_data = """
#cloud-config
package_update: true
package_upgrade: true

groups:
    - docker

packages:
    - apt-transport-https
    - ca-certificates
    - curl
    - software-properties-common

runcmd:
    - curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
    - add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    - apt-get update -y
    - apt-get install -y docker-ce docker-ce-cli containerd.io
    - curl -L "https://github.com/docker/compose/releases/download/1.28.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    - chmod +x /usr/local/bin/docker-compose
    - systemctl enable docker
    - systemctl enable containerd
    - systemctl start docker
    - systemctl start containerd
    - systemctl status docker
    - systemctl status containerd

final_message: "Docker host should be up and running, this took me $UPTIME seconds"
"""

servers = client.servers.get_all()
for server in servers:
    print(f"{server.id=} {server.name=} {server.status=}")
    
def parse_percentage(percentage_str):
    # Remove the '%' and convert to float
    value = float(percentage_str.replace('%', ''))
    return value

def parse_and_normalise_percentage(percentage_str):
    cpu_cores = 16
    value = float(percentage_str.replace('%', ''))
    normalised_value = value / cpu_cores
    return normalised_value

def parse_memory(memory_str):
    # Convert memory string (e.g., "100MiB / 1.944GiB") to percentage
    used, total = memory_str.split(' / ')
    return float(used.split('MiB')[0])

def add_server_to_known_hosts(server_ip):
    # Create a temporary file for the keyscan output
    temp_file = "temp_keyscan.txt"
    
    # Run keyscan and save output to a temporary file
    subprocess.run(["ssh-keyscan", "-H", server_ip], stdout=open(temp_file, "w"))
    
    # Get the path to the known_hosts file
    known_hosts_path = os.path.expanduser("~/.ssh/known_hosts")
    
    # Ensure the .ssh directory exists
    os.makedirs(os.path.dirname(known_hosts_path), exist_ok=True)
    
    if os.path.exists(known_hosts_path):
        print("deleted known hosts file")
        os.remove(known_hosts_path)
    
    # Append the contents to known_hosts
    with open(temp_file, "r") as temp, open(known_hosts_path, "w") as known_hosts:
        keyscan_output = temp.read()
        known_hosts.write(keyscan_output)
    
    # Clean up
    os.remove(temp_file)
    
    print(f"Added {server_ip} to known hosts")

def test_ssh_connection(server_ip, user="admin"):
    print(f"Testing SSH connection to {server_ip}... as user role {user}")
    
    try:
        result = subprocess.run([
            "ssh", 
            "-o", "StrictHostKeyChecking=no",
            "-i", os.path.expanduser("~/.ssh/id_ed25519"),
            f"{user}@{server_ip}",
            "echo 'SSH connection successful'"
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            print("SSH connection test successful")
            return True
        else:
            print(f"SSH connection failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"SSH connection error: {e}")
        return False
    
def setup_test_environment():
    ssh_key = None
    try:
        # Try to get existing key first
        ssh_keys = client.ssh_keys.get_all()
        print(f'all ssh keys: {ssh_keys}')
        for key in ssh_keys:
            print(f'key name: {key.name}')
            if key.name == "test-key":
                ssh_key = key
                break
        
        # If no key found, create one
        if ssh_key is None:
            ssh_key_response = client.ssh_keys.create(
                name="test-key",
                public_key=open(os.path.expanduser("~/.ssh/id_ed25519.pub")).read()
            )
            ssh_key = ssh_key_response
            print(f'new ssh key: {ssh_key}')
    except Exception as e:
        print(f"Error with SSH key: {e}")
        return
    
    for server in servers:
        if server.name == "bun-performance-test":
            print("Found existing server")
            return server
        
    print("Creating new server...") 
    # Create server for backend and database
    server_response = client.servers.create(
        name="bun-performance-test",
        server_type=ServerType(name="cx52"),  # 16 vCPUs, 32 GB RAM
        image=Image(name="ubuntu-22.04"),
        ssh_keys=[ssh_key],
        user_data=user_data
    )
    
    server = server_response.server
    print(f"Server created with ID {server.id} and IP {server.public_net.ipv4.ip}")
    
    # Wait for server to be ready
    print("Waiting for server to initialize...")
    time.sleep(300)  # Give some time for cloud-init to complete
    
    cmd = "docker --version"
    output = subprocess.check_output(cmd, shell=True).decode()
    print(f'Docker version: {output}')
        
    return server

def start_container_stats_monitoring():
    # Create and start a daemon thread
    stop_flag = threading.Event()
    stats_thread = threading.Thread(target=get_container_stats, args=(stop_flag,), daemon=True)
    stats_thread.start()
    return stats_thread, stop_flag

def get_container_stats(stop_flag):
    while not stop_flag.is_set():
        start_time = time.time()  # Track when we start each iteration
        print(f"Starting stats collection at {datetime.now()}")
        
        try:
            # Get docker stats
            cmd = "docker stats --no-stream --format json"
            output = subprocess.check_output(cmd, shell=True).decode()
            
            # Parse each line
            for line in output.splitlines():
                try:
                    if line.strip():  # Check if line is not empty
                        container = json.loads(line)
                        
                        date_time = datetime.now(timezone.utc).isoformat(timespec='milliseconds').replace('+00:00', 'Z')
                        headers = {
                            'Content-Type': 'application/json',
                            'private_key': 'sQJd9mFQibWGtFc7drqGnB'
                        }
                        
                        if container['Name'] == "thesis-backend-1":
                            readings = [
                                {
                                    'name': 'cpu usage backend',
                                    'time': date_time,
                                    'unit': '%',
                                    'value': parse_and_normalise_percentage(container['CPUPerc']),
                                    'category': 'backend'
                                },
                                {
                                    'name': 'memory usage backend',
                                    'time': date_time,
                                    'unit': '%',
                                    'value': parse_percentage(container['MemPerc']),
                                    'category': 'backend'
                                }
                            ]
                            
                            payload = json.dumps(readings)
                            
                            response = requests.post('https://preview.master-thesis.hjemmet.net/api/readings', headers=headers, data=payload)
                            print(response.status_code)
                            print(response.headers)
                            print(response.text)
                        if container['Name'] == "thesis-timescaledb-1":
                            readings = [
                                {
                                    'name': 'cpu usage database',
                                    'time': date_time,
                                    'unit': '%',
                                    'value': parse_and_normalise_percentage(container['CPUPerc']),
                                    'category': 'database'
                                },
                                {
                                    'name': 'memory usage database',
                                    'time': date_time,
                                    'unit': '%',
                                    'value': parse_percentage(container['MemPerc']),
                                    'category': 'database'
                                }
                            ]
                            
                            payload = json.dumps(readings)
                            
                            response = requests.post('https://preview.master-thesis.hjemmet.net/api/readings', headers=headers, data=payload)
                            print(response.status_code)
                            print(response.headers)
                            print(response.text)
                            
                            # print(f"Name: {container['Name']}")
                            # print(f"CPU: {container['CPUPerc']}")
                            # print(f"Memory: {container['MemUsage']}")
                except json.JSONDecodeError as e:
                    print(f"Error parsing container data: {e}")
                    print(f"Raw line: {line}")
                    
        except subprocess.CalledProcessError as e:
            print(f"Error running docker stats: {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")
        
        # Calculate how long this iteration took
        elapsed_time = time.time() - start_time
        print(f"Stats collection took {elapsed_time:.2f} seconds")
        
        # Adjust sleep time to maintain 5-second intervals
        sleep_time = max(0, 5 - elapsed_time)
        print(f"Sleeping for {sleep_time:.2f} seconds")
        time.sleep(sleep_time)

def deploy_application(server):
    server_ip = server.public_net.ipv4.ip
    add_server_to_known_hosts(server_ip)
    print(f'server ip: {server_ip}')
    user = "root"
    
    os.environ["DOCKER_HOST"] = f"ssh://{user}@{server_ip}"
    os.environ["DOCKER_DEFAULT_PLATFORM"] = "linux/amd64"
    
    os.environ["DOCKER_BUILDKIT"] = "1"
    os.environ["COMPOSE_DOCKER_CLI_BUILD"] = "1"
    os.environ["DOCKER_CLI_EXPERIMENTAL"] = "enabled"
    
    ssh_config = (
        f"Host {server_ip}\n"
        "  StrictHostKeyChecking no\n"
        "  UserKnownHostsFile /dev/null\n"
    )
    
    ssh_config_path = os.path.expanduser("~/.ssh/config")
    os.makedirs(os.path.dirname(ssh_config_path), exist_ok=True)
    with open(ssh_config_path, "w") as f:
        f.write(ssh_config)
    
    current_dir = os.getcwd()
    
    try:
        os.chdir("../../")
        print(f'changed directory {os.getcwd()}')
        subprocess.run(["docker", "compose", "-f", "compose.yaml", "up", "backend", "timescaledb", "migrate", "--build", "--wait"], check=True, env=dict(os.environ))
        print("Application deployed and started")
    except subprocess.CalledProcessError as e:
        print(f"Docker command failed: {e}")
    finally:
        print("returning to original dir...")
        os.chdir(current_dir)
    
    time.sleep(10)
    
    return server.public_net.ipv4.ip
    # return "localhost"

def run_load_test(server_ip):    
    # Run the progressive load test
    rps = 100
    max_rps = 2000
    increment = 100
    
    stats_thread, stop_flag = start_container_stats_monitoring()
    
    while rps <= max_rps:
        print(f"Testing with {rps} requests per second...")
        
        result = subprocess.run([
            "k6", "run",
            "--env", f"RPS={rps}", "--env", f"SERVER_IP={server_ip}",
            "load_test_local.js"
        ])
        
        if result.returncode != 0:
            print(f"Breaking point reached at {rps} RPS")
            
            # Find stable maximum
            stable_rps = rps - increment
            
            return stable_rps
        
        rps += increment
    
    stop_flag.set()
    stats_thread.join()
    
    return rps

def cleanup(server):
    print(f"Deleting server with ID {server.id}")
    client.servers.delete(server)

def main():
    try:
        # Setup the test environment
        server = setup_test_environment()
        
        # Deploy the application
        server_ip = deploy_application(server)
        
        # Run the load test
        stable_rps = run_load_test(server_ip)
        
        print(f"Test completed. Maximum stable RPS: {stable_rps}")
        
    finally:
        # Cleanup resources to avoid unnecessary costs
        if 'server' in locals():
            cleanup(server)

if __name__ == "__main__":
    main()