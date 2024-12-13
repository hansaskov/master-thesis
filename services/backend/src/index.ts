import { logger } from "@bogeychan/elysia-logger";
import { treaty } from "@elysiajs/eden";
import { swagger } from "@elysiajs/swagger";
import { Elysia, error, t } from "elysia";
import { authRoutes } from "./auth/routes";
import { organizationsApi } from "./db/collection/organizations/api";
import { readings } from "./db/collection/readings/api";
import { systemsApi } from "./db/collection/systems/api";
import { Types } from "./types";

const api = new Elysia({ prefix: "/api" })
	.use(authRoutes)
	.use(readings)
	.use(organizationsApi)
	.use(systemsApi);

const app = new Elysia({ precompile: true })
	.use(logger())
	.use(swagger({ path: "/api/swagger" }))
	.use(api)
	.listen(process.env.PORT as string);

console.log(`🦊 Server started at ${app.server?.url.origin}`);

export type App = typeof app;
export type * as Types from "./db/collection";