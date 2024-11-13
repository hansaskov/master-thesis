import { swagger } from "@elysiajs/swagger";
import { Elysia, error, t } from "elysia";
import { authRoutes } from "./auth/routes";
import { readings } from "./db/tables/readings/api";

const api = new Elysia({ prefix: "/api" }).use(authRoutes).use(readings);

const app = new Elysia()
	.use(swagger({ path: "/api/swagger" }))
	.use(api)
	.listen(process.env.PORT as string);

console.log(`🦊 Server started at ${app.server?.url.origin}`);

export type App = typeof app;
