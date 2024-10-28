import { swagger } from "@elysiajs/swagger";
import { Elysia, ParseError, error, t } from "elysia";
import { Schema, Table } from "./db/model";
import { db } from "./db/postgres";
import { catchError } from "./types/errors";

const api = new Elysia()
	.onBeforeHandle(({ request }) => console.log(request.url))
	.post(
		"/organization",
		async ({ body }) => {
			const [e, data] = await catchError(db.insert(Table.organizations).values(body));
			if (e) {
				return error("I'm a teapot");
			}

			return data;
		},
		{
			body: t.Object({
				name: Schema.organizations.name,
			}),
		},
	);

const app = new Elysia({ prefix: "/api" })
	.use(swagger())
	.use(api)
	.listen(process.env.PORT as string);

console.log(`🦊 Server started at ${app.server?.url.origin}`);

export type App = typeof app;
