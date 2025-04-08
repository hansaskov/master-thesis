import { systems } from "$collections/systems/schema";
import type { StrictPick } from "$types/strict";
import { boolean, pgTable, primaryKey, real, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";

export const threshold = pgTable(
	"threshold",
	{
		system_id: text()
			.notNull()
			.references(() => systems.id, { onDelete: "cascade" }),
		category: text().notNull().default("Others"),
		unit: text().notNull(),
		name: text().notNull(),
		threshold: real().notNull(),
		enabled: boolean().notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.system_id, table.category, table.unit, table.name],
		}),
	],
);

const uniqueKeys = ["system_id", "category", "name", "unit"] as const;

export const selectThresholdSchema = createSelectSchema(threshold);
export const insertThresholdSchema = createInsertSchema(threshold);
export const uniqueThresholdSchema = t.Pick(selectThresholdSchema, uniqueKeys);

export type Threshold = typeof threshold.$inferSelect;
export type ThresholdNew = typeof threshold.$inferInsert;
export type ThresholdUnique = StrictPick<
	Threshold,
	(typeof uniqueKeys)[number]
>;
