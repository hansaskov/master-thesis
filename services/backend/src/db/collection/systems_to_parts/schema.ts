import { pgEnum, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import type { PartialExcept } from "../../../types/strict";
import { parts } from "../parts/schema";
import { systems } from "../systems/schema";

export const systemsToParts = pgTable(
	"systems_to_parts",
	{
		parts_id: text()
			.notNull()
			.references(() => parts.id, { onDelete: "cascade" }),
		system_id: text()
			.notNull()
			.references(() => systems.id, { onDelete: "cascade" }),
	},
	(table) => [primaryKey({ columns: [table.system_id, table.parts_id] })],
);

export type SystemToParts = typeof systemsToParts.$inferSelect;
export type SystemToPartsNew = typeof systemsToParts.$inferInsert;
export type SystemToToPartsUpdate = PartialExcept<
	SystemToParts,
	"system_id" | "parts_id"
>;
