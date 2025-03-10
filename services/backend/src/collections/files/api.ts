import { authMiddleware } from "$auth/middleware";
import { generateRandomString } from "$utils/random";
import { write } from "bun";
import Elysia, { error, t } from "elysia";
import { s3 } from "../../db/s3";

export const fileApi = new Elysia({ prefix: "files" }).use(authMiddleware).post(
	"/",
	async ({ user, body: { image, title } }) => {
		const metadata = s3.file(title);
		const buffer = await image.arrayBuffer();
		await write(metadata, buffer);
	},
	{
		body: t.Object({
			title: t.String(),
			image: t.File(),
		}),
		isSuperAdmin: true,
	},
);
