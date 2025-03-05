import { S3Client, env, file } from "bun";

console.log("🚀 Starting S3 download script");

const S3_ACCESS_KEY_ID = env.S3_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY = env.S3_SECRET_ACCESS_KEY;
const S3_BUCKET = env.S3_BUCKET ?? "local";
const S3_ENDPOINT = env.S3_ENDPOINT ?? "http://localhost:9000";
const s3FilePath = process.argv[2];
const localFilePath = process.argv[3];

if (!s3FilePath) throw new Error("❌ Missing s3FilePath argument. Provide an s3FilePath key to download.");
if (!localFilePath) throw new Error("❌ Missing S3 key argument. Provide an S3 object key to download.");
if (!S3_ACCESS_KEY_ID) throw new Error("❌ Missing environment variable: S3_ACCESS_KEY_ID");
if (!S3_SECRET_ACCESS_KEY) throw new Error("❌ Missing environment variable: S3_SECRET_ACCESS_KEY");
if (!S3_BUCKET) console.warn("⚠️ S3_BUCKET environment variable not set, using default 'local'.");
if (!S3_ENDPOINT) console.warn("⚠️ S3_ENDPOINT environment variable not set, using default 'http://localhost:9000'.");

// Initialize clients
console.log(`⏳ Initializing S3 from bucket ${S3_BUCKET} and local file`)
const localFile = file(localFilePath);
const minio = new S3Client({
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    bucket: S3_BUCKET,
    endpoint: S3_ENDPOINT,
});

if (await localFile.exists()) throw new Error(`❌ Exsisting file found at path: ${localFilePath}. Not allowed to overwrite`);

const s3File = minio.file(s3FilePath);

if (!await s3File.exists()) throw new Error(`❌ File "${s3FilePath}" not found in S3 bucket`);


console.log(`📥 Downloading "${s3FilePath}" from bucket "${S3_BUCKET}"...`);
const content = await s3File.arrayBuffer();
await Bun.write(localFile, content);

console.log(`✅ Successfully saved to: ${localFilePath}`);