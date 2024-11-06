import Elysia, { error, t } from "elysia";
import { Queries, Schema, Table } from "../../model";
import { db } from "../../postgres";

export const readings = new Elysia().post(
	"/reading",
	async ({ headers, body }) => {
		const key = await Queries.keys.selectUnique(headers);
		if (!key) {
			return error("Unauthorized", "The provided key does not exists");
		}
		// Give a the relation to each reading
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
			{
				minItems: 1,
			},
		),
	},
);
