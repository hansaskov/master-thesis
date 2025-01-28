import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import Elysia, { error, t } from "elysia";

export const readingsApi = new Elysia()
	.post(
		"/reading",
		async ({ headers, body }) => {
			const key = await Queries.keys.select(headers);
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
			const readings = await Queries.readings.selectAll({
				system_id: query.system_id,
			});
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
	)
	.get(
		"/latest_reading",
		async ({ query: { name, system_id } }) => {
			const reading = await Queries.readings.selectLatest({ system_id, name });

			return reading;
		},
		{
			query: t.Object({
				system_id: Schema.insert.readings.system_id,
				name: Schema.insert.readings.name,
			}),
		},
	);
