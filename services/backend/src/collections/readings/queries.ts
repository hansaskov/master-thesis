import { start } from "node:repl";
import { db } from "$db/postgres";
import type { Types } from "$types/collection";
import type { StrictOmit, StrictPick } from "$types/strict";
import { and, between, desc, eq, sql } from "drizzle-orm/sql";
import { readings } from "./schema";

export const readingsQueries = {
	createMany: async (values: Types.ReadingNew[]) =>
		await db.insert(readings).values(values).returning(),
	insert: async (values: Types.Reading[]) =>
		await db.insert(readings).values(values),
	insertWithSystemId: async (
		values: StrictOmit<Types.ReadingNew, "system_id">[],
		{ system_id }: StrictPick<Types.ReadingNew, "system_id">,
	) => {
		const newValues = values.map((reading) => ({
			...reading,
			system_id,
		}));

		await db.insert(readings).values(newValues);
	},
	selectAll: async ({
		system_id,
		start,
		end,
		limit,
	}: {
		system_id: string;
		start: Date;
		end: Date;
		limit?: number;
	}) =>
		await db
			.select()
			.from(readings)
			.where(
				and(
					eq(readings.system_id, system_id),
					between(readings.time, start, end),
				),
			)
			.limit(limit ?? 1000),
	selectLatest: async ({
		system_id,
		name,
	}: StrictPick<Types.Reading, "system_id" | "name">) => {
		return await db
			.select()
			.from(readings)
			.where(and(eq(readings.system_id, system_id), eq(readings.name, name)))
			.orderBy(desc(readings.time))
			.limit(1)
			.then((v) => v.at(0));
	},
};
