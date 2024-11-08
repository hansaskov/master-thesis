import Elysia, { error, t } from "elysia";
import { Queries, Schema, Table } from "../../model";
import { db } from "../../postgres";
import { IsoDate } from "../../utils";

export const readings = new Elysia()
	.post(
		"/reading",
		async ({ headers, body }) => {
			const key = await Queries.keys.selectUnique(headers);
			if (!key) {
				return error("Unauthorized", "The provided key does not exists");
			}

			const values = body.map((reading) => ({
				time: new Date(reading.time),
				name: reading.name,
				value: reading.value,
				unit: reading.unit,
			}));

			await Queries.readings.insertWithSystemId(values, key.private_key);
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
	)
	.get(
		"/readings",
		async ({ query }) => {
			const readings = await Queries.readings.selectAll({ system_id: query.system_id });
			return readings;
		},
		{
			query: t.Object({
				system_id: Schema.insert.readings.system_id,
				startDate: Schema.insert.readings.time,
				endDate: t.Optional(Schema.insert.readings.time),
				name: t.Optional(Schema.insert.readings.name),
				limit: t.Optional(t.Number({ minimum: 1, maximum: 1000 })),
			}),
		},
	);
