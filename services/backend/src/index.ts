import { logger } from "@bogeychan/elysia-logger";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { authRoutes } from "./auth/routes";
import { organizationsApi } from "./db/collections/organizations/api";
import { readings } from "./db/collections/readings/api";
import { systemsApi } from "./db/collections/systems/api";
import { partsApi } from "$db/collections/parts/api";


const api = new Elysia({ prefix: "/api" })
	.use(authRoutes)
	.use(readings)
	.use(organizationsApi)
	.use(systemsApi)
	.use(partsApi);

const app = new Elysia({ precompile: true })
	.use(logger())
	.use(swagger({ path: "/api/swagger" }))
	.use(api)
	.listen(process.env.PORT as string);

console.log(`🦊 Server started at ${app.server?.url.origin}`);

export type App = typeof app;
export type * as Types from "./db/collections";
