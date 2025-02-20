import { $, env, file } from "bun";

// Validate required environment variables
console.log("🚀 Starting upload script");
const filePath = process.argv[2];
const force = process.argv[3] === "--force";
const POSTGRES_USER = env.POSTGRES_USER;
const POSTGRES_DB = env.POSTGRES_DB;

if (!filePath) throw new Error("❌ Missing file path argument. Please provide a file path when running the script.");
if (await file(filePath).exists() && !force) throw new Error(`❌ File found at: ${filePath}. Refusing to overwrite ${filePath}. use --force to overwrite the file`);
if (!POSTGRES_USER) throw new Error("❌ Missing environment variable: POSTGRES_USER")
if (!POSTGRES_DB ) throw new Error("❌ Missing environment variable: POSTGRES_DB")
if (force) console.warn(`⚠️  Using --force flag. will overwrite`);   

console.info(`📁 File path argument received: ${filePath}`);    

// Execute backup command using Bun's shell
const backup = $
    `docker compose exec timescaledb pg_dump \
    -U ${POSTGRES_USER} \
    -d ${POSTGRES_DB} \
    --format=custom > ${filePath}`;

console.log(`⏳ Starting Backup at: ${filePath}`);

await backup

console.log(`✅ Backup successfully created at: ${filePath}`);