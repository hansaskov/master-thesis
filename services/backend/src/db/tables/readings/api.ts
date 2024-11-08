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
	// It is possible to filter for readings by name
	//
	// TODO! Needs authentication and authorization.
	.get(
		"/readings/:system_id",
		({ params: { system_id } }) => {
			// Authenticate user
			// Authorize user.

			const readings = Queries.readings.selectAll({ system_id });

			return readings;
		},
		{},
	);
