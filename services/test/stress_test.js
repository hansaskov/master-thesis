/*
k6 run load_test.js

k6 run load_test.js --env SERVER_IP=127.0.0.1
*/
import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL =  `http://localhost:3000`
const ENDPOINT = '/api/readings';
const FULL_URL = `${BASE_URL}${ENDPOINT}`;
const INITIAL_RPS = 1000 

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
  const numKeys = INITIAL_RPS * 3;
  const keys = Array(numKeys)
    .fill()
    .map(() => createKey())
    .filter(key => key !== null)
    .map(v => v.private_key)



  console.log(`Created ${keys.length} keys`);

  console.log("Pausing 10 seconds")
  sleep(10)
  return { keys };
}


export const options = {
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(95)', 'p(99)'],
  stages: [
    { duration: '5m', target: INITIAL_RPS * 3 },
  ],
  thresholds: {
    http_req_failed: [
      { threshold: 'rate<0.05', abortOnFail: false }
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
      value: 209764381 % (vuIndex + 1),
      category: category,
    },
    {
      name: "cpu usage",
      time: timestamp,
      unit: "%",
      value: 209764381 % (vuIndex + 1),
      category: category,
    },
    {
      name: "disk usage",
      time: timestamp,
      unit: "%",
      value: 209764381 % (vuIndex + 1),
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