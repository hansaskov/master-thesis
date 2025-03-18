import {
	TsTimeBucket,
	avg,
	first,
	last,
	max,
	min,
} from "$db/drizzle/customTypes";
import { db } from "$db/postgres";
import type { PartialExcept } from "$types/strict";
import { count } from "drizzle-orm";
import {
	pgMaterializedView,
	pgTable,
	primaryKey,
	real,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { systems } from "../systems/schema";

export const readings = pgTable(
	"readings",
	{
		time: timestamp({ withTimezone: true, mode: "date" }).notNull(),
		system_id: text()
			.notNull()
			.references(() => systems.id, { onDelete: "cascade" }),
		name: text().notNull(),
		value: real().notNull(),
		unit: text().notNull(),
		category: text(),
	},
	(table) => [
		primaryKey({
			columns: [
				table.system_id,
				table.category,
				table.unit,
				table.name,
				table.time,
			],
		}),
	],
);

export const readings_5min_agg = pgMaterializedView("readings_5min_agg")
	.withNoData()
	.as((qb) => {
		return qb
			.select({
				bucket: TsTimeBucket("5 minutes", readings.time).as("bucket"),
				name: readings.name,
				unit: readings.unit,
				category: readings.category,
				system_id: readings.system_id,
				avg: avg(readings.value).as("avg"),
				min: min(readings.value).as("min"),
				max: max(readings.value).as("max"),
				count: count().as("count"),
				first: first(readings.time).as("first"),
				last: last(readings.time).as("last"),
			})
			.from(readings)
			.groupBy(({ system_id, category, unit, name, bucket }) => [
				system_id,
				category,
				unit,
				name,
				bucket,
			]);
	});

const test = await db.select().from(readings_5min_agg);

export const insertReadingsSchema = createInsertSchema(readings, {
	time: t.String({ format: "iso-date-time" }),
	system_id: t.String({ minLength: 1 }),
	name: t.String({ minLength: 1 }),
	unit: t.String({ minLength: 1 }),
});

export const selectReadingsSchema = createSelectSchema(readings);

export type Reading = typeof readings.$inferSelect;
export type ReadingNew = typeof readings.$inferInsert;
export type ReadingUpdate = PartialExcept<
	Reading,
	"time" | "system_id" | "name"
>;
