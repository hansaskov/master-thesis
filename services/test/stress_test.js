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
//import { open } from 'k6/fs';

//const SERVER_IP = "http"
const BASE_URL =  `http://localhost`
const ENDPOINT = '/api/readings';
const FULL_URL = `${BASE_URL}${ENDPOINT}`;
const INITIAL_RPS = 40


const file = open('./test_keys_local.txt');
const arrayOfKeys = file.toString().split('\n');

const keyArray = arrayOfKeys
    .map(line => line.trim())
    .filter(line => line.length > 0);

console.log(keyArray)

export const options = {
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(95)', 'p(99)'],
  stages: [
    { duration: '30s', target: INITIAL_RPS * 1 },
    { duration: '30s', target: INITIAL_RPS * 1 },
    // { duration: '30m', target: INITIAL_RPS * 2 },
    // { duration: '1m', target: INITIAL_RPS * 2 },
    // { duration: '30s', target: INITIAL_RPS * 3 },
    // { duration: '1m', target: INITIAL_RPS * 3 },
    // { duration: '30s', target: INITIAL_RPS * 4 },
    // { duration: '1m', target: INITIAL_RPS * 4 },
    // { duration: '30s', target: INITIAL_RPS * 5 },
    // { duration: '1m', target: INITIAL_RPS * 5 },
    // { duration: '30m', target: INITIAL_RPS * 6 },
    // { duration: '1m', target: INITIAL_RPS * 6 },
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
  const vuIndex = (__VU - 1) % keyArray.length;
  const privateKey = keyArray[vuIndex];

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