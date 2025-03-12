import { environment } from "$config/environment";
import { S3Client } from "bun";

export const s3 = new S3Client({
	accessKeyId: environment.S3_ACCESS_KEY_ID,
	secretAccessKey: environment.S3_SECRET_ACCESS_KEY,
	endpoint: environment.S3_ENDPOINT,
	bucket: environment.S3_BUCKET,
});
