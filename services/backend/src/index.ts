import { authApi } from "$collections/auth/api";
import { healthApi } from "$collections/health/api";
import { organizationsApi } from "$collections/organizations/api";
import { partsApi } from "$collections/parts/api";
import { readingsApi } from "$collections/readings/api";
import { systemsApi } from "$collections/systems/api";
import { logger } from "@bogeychan/elysia-logger";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

const api = new Elysia({ prefix: "/api" })
	.use(authApi)
	.use(readingsApi)
	.use(organizationsApi)
	.use(healthApi)
	.use(systemsApi)
	.use(partsApi);

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
export type * as Types from "$collections/index";
