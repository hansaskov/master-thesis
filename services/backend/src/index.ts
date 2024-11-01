import { swagger } from "@elysiajs/swagger";
import { Elysia, error, t } from "elysia";
import { Queries, Schema, Table } from "./db/model";
import { db } from "./db/postgres";
import { catchError } from "./types/errors";

const readings = new Elysia().post(
	"/reading",
	async ({ headers, body }) => {
		const key = await Queries.keys.selectUnique(headers);

		if (!key) {
			return error("Bad Request", "The provided key does not exists");
		}

		const values = body.map((reading) => ({
			systems_id: key.private_key,
			...reading,
		}));

		await db.insert(Table.readings).values(values);
	},
	{
		headers: t.Object({
			public_key: Schema.select.keys.public_key,
			private_key: Schema.select.keys.private_key,
		}),
		body: t.Array(
			t.Object({
				time: Schema.insert.readings.time,
				name: Schema.insert.readings.name,
				value: Schema.insert.readings.value,
				unit: Schema.insert.readings.unit,
			}),
		),
	},
);

const api = new Elysia().onBeforeHandle(({ request }) => console.log(request.url));

const app = new Elysia({ prefix: "/api" })
	.use(swagger())
	.use(api)
	.listen(process.env.PORT as string);

console.log(`🦊 Server started at ${app.server?.url.origin}`);

export type App = typeof app;
