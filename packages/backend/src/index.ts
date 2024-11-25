import { logger } from "@bogeychan/elysia-logger";
import { Elysia, t } from "elysia";

const api = new Elysia({ prefix: "/api" }).get(
	"/hello",
	({ query }) => `Hello ${query.name}`,
	{
		query: t.Object({
			name: t.String(),
		}),
	},
);

const app = new Elysia()
	.use(logger())
	.use(api);

app.listen(process.env.PORT as string, () =>
	console.log(`🦊 Server started at ${app.server?.url.origin}`),
);

export type App = typeof app;
