import { S3Client, write, env, file } from "bun";
import path from 'path';

console.log("🚀 Starting S3 upload script");

const S3_ACCESS_KEY_ID = env.S3_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY = env.S3_SECRET_ACCESS_KEY;
const S3_BUCKET = env.S3_BUCKET ?? "local";
const S3_ENDPOINT = env.S3_ENDPOINT ?? "http://localhost:9000";
const filePath = process.argv[2];
const inputFile = file(filePath);

if (!S3_ACCESS_KEY_ID) throw new Error("❌ Missing environment variable: S3_ACCESS_KEY_ID");
if (!S3_SECRET_ACCESS_KEY) throw new Error("❌ Missing environment variable: S3_SECRET_ACCESS_KEY");
if (!S3_BUCKET) console.warn("⚠️ S3_BUCKET environment variable is not set, using default 'local'.");
if (!S3_ENDPOINT) console.warn("⚠️ S3_ENDPOINT environment variable is not set, using default 'http://localhost:9000'.");
if (!filePath) throw new Error("❌ Missing file path argument. Please provide a file path when running the script.");
if (!await inputFile.exists()) throw new Error(`❌ File not found at path: ${filePath}`);

console.info(`📁 File path argument received: ${filePath}`);

const fileContent = await inputFile.arrayBuffer();
const fileName = path.basename(filePath);

const minio = new S3Client({
  accessKeyId: S3_ACCESS_KEY_ID,
  secretAccessKey: S3_SECRET_ACCESS_KEY,
  bucket: S3_BUCKET,
  endpoint: S3_ENDPOINT,
});

const metadata = minio.file(fileName);

console.log(`📤 Uploading "${fileName}" to S3 bucket "${S3_BUCKET}"...`);
await write(metadata, fileContent);

console.log(`🎉 Uploaded "${fileName}" to S3 successfully!`);

