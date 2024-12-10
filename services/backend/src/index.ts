import { logger } from "@bogeychan/elysia-logger";
import { treaty } from "@elysiajs/eden";
import { swagger } from "@elysiajs/swagger";
import { Elysia, error, t } from "elysia";
import { authRoutes } from "./auth/routes";
import { organizationsApi } from "./db/tables/organizations/api";
import { readings } from "./db/tables/readings/api";
import { systemsApi } from "./db/tables/systems/api";

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
export type * as Types from "./db/tables/index";
