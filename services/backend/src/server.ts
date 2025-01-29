import { api } from "$collections/api";
import { logger } from "@bogeychan/elysia-logger";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

export const app = new Elysia({ precompile: true })
	.get(
		".well-known/microsoft-identity-association.json",
		Bun.file("public/.well-known/microsoft-identity-association.json"),
	)
	.use(logger())
	.use(swagger({ path: "/api/swagger" }))
	.use(api);
