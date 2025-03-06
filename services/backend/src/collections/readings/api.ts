import { authMiddleware } from "$auth/middleware";
import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import Elysia, { error, t } from "elysia";

export const readingsApi = new Elysia()
	.use(authMiddleware)
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

			await Queries.readings.insertWithSystemId(values, {
				system_id: key.system_id,
			});
		},
		{
			headers: t.Object({
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
			const start = new Date(query.start);
			const end = new Date(query.end);

			return await Queries.readings.select({
				start,
				end,
				system_id: query.system_id,
				limit: query.limit,
			});
		},
		{
			isOrganization: true,
			query: t.Object({
				system_id: Schema.insert.readings.system_id,
				start: t.String({ format: "date-time" }),
				end: t.String({ format: "date-time" }),
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
