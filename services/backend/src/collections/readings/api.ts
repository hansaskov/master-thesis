import { authMiddleware } from "$auth/middleware";
import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import Elysia, { error, t } from "elysia";

export const readingsApi = new Elysia()
	.use(authMiddleware)
	.post(
		"/readings",
		async ({ headers, body }) => {
			const key = await Queries.keys.select(headers);
			if (!key) {
				return error("Unauthorized", "The provided key does not exists");
			}
			const values = body.map((reading) => ({
				...reading,
				time: new Date(reading.time),
			}));

			await Queries.readings.insertWithSystemIdUnnest(values, {
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
					category: Schema.insert.readings.category,
				}),
				{
					minItems: 1,
					maxItems: 10_000,
				},
			),
		},
	)
	.get(
		"/readings",
		async ({ query }) => {
			const start = new Date(query.start);
			const end = new Date(query.end);

			if (query.resolution === "5 min") {
				return await Queries.readings_5min_agg.select({
					start,
					end,
					system_id: query.system_id,
					limit: query.limit,
				});
			}

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
				resolution: t.Union([t.Literal("full"), t.Literal("5 min")]),
				system_id: Schema.insert.readings.system_id,
				start: t.String({ format: "date-time" }),
				end: t.String({ format: "date-time" }),
				limit: t.Optional(t.Number({ minimum: 1, maximum: 3600 })),
			}),
		},
	)
	.get(
		"/readings/latest",
		async ({ query }) => {
			return await Queries.readings.selectAllUnique(query);
		},
		{
			isOrganization: true,
			query: t.Object({
				system_id: Schema.insert.readings.system_id,
				category: t.Optional(Schema.insert.readings.category),
				unit: t.Optional(Schema.insert.readings.unit),
				name: t.Optional(Schema.insert.readings.name),
			}),
		},
	);
