import { db, pgClient } from "$db/postgres";
import type { Types } from "$types/collection";
import type { StrictOmit, StrictPick } from "$types/strict";
import { Param, and, asc, between, desc, eq, sql } from "drizzle-orm/sql";
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
	insertWithSystemIdUnnest: async (
		readings: StrictOmit<Types.ReadingNew, "system_id">[],
		{ system_id }: StrictPick<Types.ReadingNew, "system_id">,
	) => {
		const len = readings.length;

		// Pre-allocate arrays with known size for better memory efficiency
		const times = new Array<string>(len);
		const systemIds = new Array<string>(len);
		const names = new Array<string>(len);
		const values = new Array<number>(len);
		const units = new Array<string>(len);
		const categories = new Array<string>(len);

		// Populate column arrays in a single loop
		for (let i = 0; i < len; i++) {
			times[i] = readings[i].time.toISOString();
			systemIds[i] = system_id;
			names[i] = readings[i].name;
			values[i] = readings[i].value;
			units[i] = readings[i].unit;
			categories[i] = readings[i].category || "Other";
		}

		await pgClient`
			INSERT INTO readings (time, system_id, name, value, unit, category)
			SELECT
				UNNEST(${times}::timestamptz[]),
				UNNEST(${systemIds}::text[]),
				UNNEST(${names}::text[]),
				UNNEST(${values}::real[]),
				UNNEST(${units}::text[]),
				UNNEST(${categories}::text[])
			`;
	},
	select: async ({
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
			.orderBy(
				readings.system_id,
				readings.category,
				readings.unit,
				readings.name,
				asc(readings.time),
			)
			.limit(limit ?? 1000),
	selectAllUnique: async ({
		system_id,
		category,
		unit,
		name,
	}: StrictPick<Types.Reading, "system_id"> &
		Partial<StrictPick<Types.Reading, "category" | "unit" | "name">>) => {
		return await db
			.selectDistinctOn([
				readings.system_id,
				readings.category,
				readings.unit,
				readings.name,
			])
			.from(readings)
			.where(
				and(
					eq(readings.system_id, system_id),
					category ? eq(readings.category, category) : undefined,
					unit ? eq(readings.unit, unit) : undefined,
					name ? eq(readings.name, name) : undefined,
				),
			)
			.orderBy(
				readings.system_id,
				readings.category,
				readings.unit,
				readings.name,
				desc(readings.time),
			);
	},
};
