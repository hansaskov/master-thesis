import { swagger } from "@elysiajs/swagger";
import { Elysia, error, t } from "elysia";
import { authRoutes } from "./auth/routes";
import { readings } from "./db/tables/readings/api";
import { treaty } from '@elysiajs/eden'

const api = new Elysia({ prefix: "/api" }).use(authRoutes).use(readings);

const app = new Elysia({ precompile: true })
	.use(swagger({ path: "/api/swagger" }))
	.use(api)
	.listen(process.env.PORT as string);

console.log(`🦊 Server started at ${app.server?.url.origin}`);

export type App = typeof app;

const client = treaty<App>('localhost:3000').api

client.latest_reading.get({
	query: {
		name: "test",
		system_id: "test"
	}
})