import {
	pgTable,
	primaryKey,
	real,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import type { PartialExcept } from "../../../types/strict";
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
	},
	(table) => [
		primaryKey({ columns: [table.time, table.system_id, table.name] }),
	],
);

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
