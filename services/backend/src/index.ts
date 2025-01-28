import { api } from "$collections/api";
import { logger } from "@bogeychan/elysia-logger";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

const app = new Elysia({ precompile: true })
	.get(
		".well-known/microsoft-identity-association.json",
		Bun.file("public/.well-known/microsoft-identity-association.json"),
	)
	.use(logger())
	.use(swagger({ path: "/api/swagger" }))
	.use(api)
	.listen(process.env.PORT as string);

console.log(`🦊 Server started at ${app.server?.url.origin}`);

export type App = typeof app;
export type * as Types from "$collections/types";
