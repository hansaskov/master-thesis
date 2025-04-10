import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('error_rate');
const throughputKB = new Trend('throughput_kb');

// Configuration variables
//const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'http://' + __ENV.SERVER_IP + ':3000'
console.log(`base url: ${BASE_URL}`);
const ENDPOINT = '/api/readings';
const TEST_DURATION = '5m';
const INITIAL_RPS = 100;
const RPS_INCREMENT = 100;
const CURRENT_RPS = __ENV.RPS ? parseInt(__ENV.RPS) : INITIAL_RPS;

export function setup() {
    // Create organization
    const orgPayload = JSON.stringify({ name: "Test org 2" });
    
    const params = {
        headers: {
            'Content-Type': 'application/json'
        },
        // Add an empty cookie to satisfy the middleware
        cookies: {
            sessionId: 'test-session-id'
        }
    };
    
    const orgResponse = http.post(`${BASE_URL}/api/organizations`, orgPayload, params);
    
    console.log(`Status: ${orgResponse.status}, ID: ${orgResponse.body}`);
    const orgResponseData = JSON.parse(orgResponse.body)

    // Create vision system
    const visionSystem = {
        name: "test system",
        organization_id: `${orgResponseData.id}`,
        system_model: "VisioPointer"
    }

    const systemPayload = JSON.stringify(visionSystem);

    const systemResponse = http.post(`${BASE_URL}/api/systems`, systemPayload, params);
    console.log(`Status: ${systemResponse.status}, Body: ${systemResponse.body}`)
    const systemReponseData = JSON.parse(systemResponse.body)

    // Create and return key
    const key = {
        name: "test key",
        system_id: `${systemReponseData.id}`
    }

    const keyPayload = JSON.stringify(key);

    const keyResponse = http.post(`${BASE_URL}/api/keys`, keyPayload, params);
    console.log(`Status: ${keyResponse.status}, Body: ${keyResponse.body}`)
    const keyResponseData = JSON.parse(keyResponse.body)

    return { private_key: keyResponseData.private_key }
}

export const options = {
    scenarios: {
        constant_request_rate: {
            executor: 'constant-arrival-rate',
            rate: CURRENT_RPS,
            timeUnit: '1s',
            duration: TEST_DURATION,
            preAllocatedVUs: 300,
            maxVUs: 1000,
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<250'],
        http_req_duration: ['p(99)<500'],
        http_req_failed: ['rate<0.01'], // 1%% error rate
    },
};

export default function(data) {
    const privateKey = data.private_key

    const reading = [
        {
            name: "cpu temperature",
            time: new Date().toISOString(),
            unit: "C",
            value: Math.random() * 100, // Random value between 0 and 100
            category: "computer",
        },
        {
            name: "cpu usage",
            time: new Date().toISOString(),
            unit: "%",
            value: Math.random() * 100,
            category: "computer",
        },
        {
            name: "disk usage",
            time: new Date().toISOString(),
            unit: "%",
            value: Math.random() * 100,
            category: "computer",
        }
    ];

    const payload = JSON.stringify(reading);

    const params = {
        headers: {
          'Content-Type': 'application/json',
          private_key: privateKey
        },
    };

    // Send POST request to server
    const response = http.post(`${BASE_URL}${ENDPOINT}`, payload, params);
    
    // Calculate response size in KB
    const responseSize = (JSON.stringify(response.body).length / 1024);
    throughputKB.add(responseSize);
    
    // Check if request was successful
    const success = check(response, {
        'status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    });
    
    // Track error rate
    errorRate.add(!success);
}