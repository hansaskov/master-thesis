from __future__ import annotations

import os
import time
import subprocess
from hcloud import Client
from hcloud.images import Image
from hcloud.server_types import ServerType
from hcloud.servers import Server
from hcloud.volumes import Volume

assert "HCLOUD_TOKEN" in os.environ, "Please export your API token in the HCLOUD_TOKEN environment variable"
token = os.environ["HCLOUD_TOKEN"]

client = Client(token=token)

servers = client.servers.get_all()
for server in servers:
    print(f"{server.id=} {server.name=} {server.status=}")
    
def setup_test_environment():
    ssh_key = None
    try:
        # Try to get existing key first
        ssh_keys = client.ssh_keys.get_all()
        for key in ssh_keys:
            if key.name == "test-key":
                ssh_key = key
                break
        
        # If no key found, create one
        if ssh_key is None:
            ssh_key_response = client.ssh_keys.create(
                name="test-key",
                public_key=open(os.path.expanduser("~/.ssh/id_rsa_sechr17.pub")).read()
            )
            ssh_key = ssh_key_response
    except Exception as e:
        print(f"Error with SSH key: {e}")
        return
    
    # Create server for backend and database
    server_response = client.servers.create(
        name="bun-performance-test",
        server_type=ServerType(name="cx52"),  # 16 vCPUs, 32 GB RAM
        image=Image(name="ubuntu-22.04"),
        ssh_keys=[ssh_key] if ssh_key else None,
        user_data="""
        #cloud-config
        packages:
          - docker.io
          - docker-compose
        runcmd:
          - systemctl enable docker
          - systemctl start docker
        """
    )
    
    server = server_response.server
    print(f"Server created with ID {server.id} and IP {server.public_net.ipv4.ip}")
    
    # Wait for server to be ready
    print("Waiting for server to initialize...")
    time.sleep(60)  # Give some time for cloud-init to complete
    
    return server

def deploy_application(server):
    # Copy your application files to the server
    subprocess.run([
        "scp", "-r", 
        "./services", 
        f"root@{server.public_net.ipv4.ip}:/root/"
    ])
    
    # Copy docker-compose files
    subprocess.run([
        "scp",
        "docker-compose.yml",
        f"root@{server.public_net.ipv4.ip}:/root/"
    ])
    
    # SSH into the server and start the application
    subprocess.run([
        "ssh", f"root@{server.public_net.ipv4.ip}",
        "cd /root && docker-compose up -d timescaledb && sleep 10 && docker-compose up -d backend"
    ])
    
    print("Application deployed and started")
    
    # Allow some time for the application to initialize
    time.sleep(30)
    
    return server.public_net.ipv4.ip

def run_load_test(server_ip, test_script="load_test.js"):
    # Create k6 test script locally
    with open(test_script, "w") as f:
        f.write("""
        import http from 'k6/http';
        import { check, sleep } from 'k6';
        import { Rate, Trend } from 'k6/metrics';

        // Custom metrics
        const errorRate = new Rate('error_rate');
        const throughputKB = new Trend('throughput_kb');

        // Configuration variables
        const BASE_URL = 'http://%s:3000';
        const ENDPOINT = '/api/health';
        const TEST_DURATION = '5m';
        const INITIAL_RPS = 10000;
        const RPS_INCREMENT = 1000;
        const CURRENT_RPS = __ENV.RPS ? parseInt(__ENV.RPS) : INITIAL_RPS;

        export const options = {
          scenarios: {
            constant_request_rate: {
              executor: 'constant-arrival-rate',
              rate: CURRENT_RPS,
              timeUnit: '1s',
              duration: TEST_DURATION,
              preAllocatedVUs: Math.ceil(CURRENT_RPS / 100),
              maxVUs: Math.ceil(CURRENT_RPS / 50),
            },
          },
          thresholds: {
            'http_req_duration{p(95)}': ['threshold: 250ms'],
            'http_req_duration{p(99)}': ['threshold: 500ms'],
            'error_rate': ['threshold: 0.01'], // 1%% error rate
          },
        };

        export default function() {
          const response = http.get(`${BASE_URL}${ENDPOINT}`);
          
          const responseSize = (JSON.stringify(response.body).length / 1024);
          throughputKB.add(responseSize);
          
          const success = check(response, {
            'status is 200': (r) => r.status === 200,
          });
          
          errorRate.add(!success);
        }
        """ % server_ip)
    
    # Run the progressive load test
    rps = 10000
    max_rps = 30000
    increment = 1000
    
    while rps <= max_rps:
        print(f"Testing with {rps} requests per second...")
        
        result = subprocess.run([
            "k6", "run", 
            "--env", f"RPS={rps}",
            test_script
        ])
        
        if result.returncode != 0:
            print(f"Breaking point reached at {rps} RPS")
            
            # Test at 500 RPS lower to find stable maximum
            stable_rps = rps - 500
            print(f"Testing stable maximum at {stable_rps} RPS for 30 minutes...")
            
            subprocess.run([
                "k6", "run",
                "--env", f"RPS={stable_rps}",
                "--duration", "30m",
                test_script
            ])
            
            break
        
        rps += increment
    
    return rps

def cleanup(server):
    print(f"Deleting server with ID {server.id}")
    client.servers.delete(server)

def main():
    try:
        # Setup the test environment
        server = setup_test_environment()
        
        # Deploy the application
        # server_ip = deploy_application(server)
        
        # Run the load test
        # max_rps = run_load_test(server_ip)
        
        # print(f"Test completed. Maximum stable RPS: {max_rps - 500}")
        
    finally:
        # Cleanup resources to avoid unnecessary costs
        if 'server' in locals():
            cleanup(server)

if __name__ == "__main__":
    main()