import { S3Client, write, env, file } from "bun";
import { environment } from "$config/environment";

export const s3 = new S3Client({
    accessKeyId: environment.S3_ACCESS_KEY_ID,
    secretAccessKey: environment.S3_SECRET_ACCESS_KEY,
    bucket: environment.S3_BUCKET,
    endpoint: environment.S3_ENDPOINT,
});