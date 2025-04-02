import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('error_rate');
const throughputKB = new Trend('throughput_kb');

// Configuration variables
const BASE_URL = 'http://localhost';
const ENDPOINT = '/api/readings';
const TEST_DURATION = '0.1m';
const INITIAL_RPS = 1000;
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
        http_req_duration: ['p(95)<250'],
        http_req_duration: ['p(99)<500'],
        http_req_failed: ['rate<0.01'] // 1%% error rate
    },
};

export default function() {
    // Correct payload format - object with name property
    const payload = JSON.stringify({ name: "Test org 2" });
    
    const params = {
        headers: {
            'Content-Type': 'application/json'
        },
        // Add an empty cookie to satisfy the middleware
        cookies: {
            sessionId: 'test-session-id'
        }
    };
    
    // Send POST request to server
    const response = http.post("http://localhost/api/organizations", payload, params);
    
    // Add validation and metrics
    const success = check(response, {
        'status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    });
    
    errorRate.add(!success);
    
    // Log the response for debugging
    console.log(`Status: ${response.status}, Body: ${response.body}`);
}

// export default function() {
//     create_organization();

//     const reading = {
//         name: "cpu temperature",
//         time: new Date().toISOString(),
//         unit: "C",
//         value: Math.random() * 100, // Random value between 0 and 100
//         category: "computer"
//     };

//     const payload = JSON.stringify([reading]);

//     const params = {
//         headers: {
//           'Content-Type': 'application/json',
//           private_key: "hFFyezyX2BXDxjB8rjAydZ"
//         },
//     };

//     // Send POST request to server
//     const response = http.post(`${BASE_URL}${ENDPOINT}`, payload, params);
    
//     // Calculate response size in KB
//     const responseSize = (JSON.stringify(response.body).length / 1024);
//     throughputKB.add(responseSize);
    
//     // Check if request was successful
//     const success = check(response, {
//         'status is 200 or 201': (r) => r.status === 200 || r.status === 201,
//     });
    
//     // Track error rate
//     errorRate.add(!success);

//     // const response = http.get(`${BASE_URL}${ENDPOINT}`);
    
//     // const responseSize = (JSON.stringify(response.body).length / 1024);
//     // throughputKB.add(responseSize);
    
//     // const success = check(response, {
//     //     'status is 200': (r) => r.status === 200,
//     // });
    
//     // errorRate.add(!success);
// }