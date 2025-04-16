/*
k6 run load_test.js

k6 run load_test.js --env SERVER_IP=127.0.0.1

curl -X POST https://api.example.com/users \
     -H "Content-Type: application/json" \
     -d '{"name": "John Doe", "email": "john@example.com"}'

*/

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const SERVER_IP = __ENV.SERVER_IP ?? "127.0.0.1"
const BASE_URL =  `http://${SERVER_IP}:3000`
const ENDPOINT = '/api/readings';
const FULL_URL = `${BASE_URL}${ENDPOINT}`;
const INITIAL_RPS = 100




function createKey() {
  const response = http.post(`${BASE_URL}/api/seed`);
  if (response.status !== 200 && response.status !== 201) {
    return null;
  }

  try {
    return JSON.parse(response.body);
  } catch (e) {
    return null;
  }
}

export function setup() {
  console.log(`Using ${BASE_URL} as the base url`)
  const numKeys = INITIAL_RPS * 2 ** 2;
  const keys = Array(numKeys)
    .fill()
    .map(() => createKey())
    .filter(key => key !== null)
    .map(v => v.private_key)

  console.log(`Created ${keys.length} keys`);
  return { keys };
}

export const options = {
  stages: [
    { duration: '30s', target: INITIAL_RPS * 2 ** 0 },
    { duration: '1m', target: INITIAL_RPS * 2 ** 0 },
    { duration: '30s', target: INITIAL_RPS * 2 ** 1 },
    { duration: '1m', target: INITIAL_RPS * 2 ** 1 },
    { duration: '30s', target: INITIAL_RPS * 2 ** 2 },
    { duration: '1m', target: INITIAL_RPS * 2 ** 2 },
    { duration: '30s', target: INITIAL_RPS * 2 ** 3 },
    { duration: '1m', target: INITIAL_RPS * 2 ** 3 },
    { duration: '30s', target: INITIAL_RPS * 2 ** 4 },
    { duration: '1m', target: INITIAL_RPS * 2 ** 4 },
    { duration: '30s', target: INITIAL_RPS * 2 ** 5 },
    { duration: '1m', target: INITIAL_RPS * 2 ** 5 },
  ],
  thresholds: {
    http_req_failed: [
      { threshold: 'rate<0.01' }
    ],
    http_req_duration: [
      { threshold: 'p(95)<250', abortOnFail: true },
      { threshold: 'p(99)<500', abortOnFail: true },
    ],
  },
};

export default function (data) {
  const vuIndex = (__VU - 1) % data.keys.length;
  const privateKey = data.keys[vuIndex];

  const timestamp = new Date().toISOString();
  const category = "computer";

  const reading = [
    {
      name: "cpu temperature",
      time: timestamp,
      unit: "C",
      value: 209764381 % vuIndex,
      category: category,
    },
    {
      name: "cpu usage",
      time: timestamp,
      unit: "%",
      value: 209764381 % vuIndex,
      category: category,
    },
    {
      name: "disk usage",
      time: timestamp,
      unit: "%",
      value: 209764381 % vuIndex,
      category: category,
    }
  ];

  const payload = JSON.stringify(reading);
  const params = {
    headers: {
      'Content-Type': 'application/json',
      private_key: privateKey
    },
  };

  const response = http.post(FULL_URL, payload, params);

  sleep(1);
}