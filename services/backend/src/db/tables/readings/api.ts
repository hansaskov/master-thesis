import Elysia, { error, t } from "elysia";
import { Queries, Schema, Table } from "../../model";
import { db } from "../../postgres";

export const readings = new Elysia()
	.post(
		"/reading",
		async ({ headers, body }) => {
			const key = await Queries.keys.selectUnique(headers);
			if (!key) {
				return error("Unauthorized", "The provided key does not exists");
			}
			// Give a the relation to each reading
			const values = body.map((reading) => ({
				system_id: key.private_key,
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
	)
	// This endpoint will return a list of readings for a production system
	// You can either provice a start and end date
	// Or just the start date and no end date. The end date is then set to the current date
	// It is also possible to filter for readings by name
	// It should only be allowed to query 1000 items and the min is 1.
	// TODO! Needs authentication and authorization.
	.get(
		"/readings/:system_id",
		({ params: { system_id }, body: { limit, endDate } }) => {
			// Authenticate user
			// Authorize user.
			const readings = Queries.readings.selectAll({ system_id });

			return readings;
		},
		{
			body: t.Union([
				t.Object({
					startDate: Schema.insert.readings.time,
					endDate: Schema.insert.readings.time,
					name: t.Optional(Schema.insert.readings.name),
					limit: t.Number({ minimum: 1, maximum: 1000, default: 100 }),
				}),
				t.Object({
					name: t.Optional(Schema.insert.readings.name),
					limit: t.Number({ minimum: 1, maximum: 1000, default: 100 }),
				})
			]),
		},
	);
