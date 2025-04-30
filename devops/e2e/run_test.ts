import { exec } from 'child_process';
//import { api } from '../../services/backend/src/collections/api';
import axios from 'axios';

function runDockerCompose() {
    try {
      // Change to root directory (going up two levels)
      process.chdir('../../');
      console.log('Current directory:', process.cwd());
  
      // Run docker compose
      exec('docker compose up --build', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error}`);
          return;
        }
        console.log(stdout);
      });
      console.log("Started docker");
    } catch (error) {
      console.error('Failed to change directory or run docker:', error);
    }
}

async function seedDatabase() {
    try {
        const response = await fetch('http://localhost:3000/api/users/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                id: Math.random().toString(36).substring(0,12),
                is_superadmin: true,
                name: "John",
                email: "Test@hotmail.com",
                email_verified: false,
                image: null,
                provider_name: "Microsoft",
                provider_id: "2",
            })
        });

        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        
        // Log headers
        console.log('Response headers:');
        for (const [key, value] of response.headers.entries()) {
            console.log(`${key}: ${value}`);
        }

        // Log raw response
        const textResponse = await response.text();
        console.log('Raw response:', textResponse);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (textResponse) {
            try {
                const data = JSON.parse(textResponse);
                console.log('Parsed data:', data);
            } catch (parseError) {
                console.error('Failed to parse response as JSON:', parseError);
            }
        } else {
            console.log('Empty response received');
        }

        console.log("Database seeded");

    } catch (error) {
        console.error('Error:', error);
    }
}

function runTest() {
    try {
        process.chdir('devops/e2e');
    
        // Run docker compose
        exec('pnpm exec playwright test', (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error}`);
            return;
          }
          console.log(stdout);
        });
        console.log("finished e2e test. Result available http://localhost:9323/");
    } catch (error) {
        console.error('Failed to change directory or run docker:', error);
    }
}

async function main() {
    await runDockerCompose();
    console.log('--- Waiting for services to become ready (20 seconds) ---');
    await new Promise(resolve => setTimeout(resolve, 30000));
    await seedDatabase();
    await runTest();
}

main();
