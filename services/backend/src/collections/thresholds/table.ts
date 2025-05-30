import { table as systems } from "$collections/systems/table";
import { boolean, pgTable, primaryKey, real, text } from "drizzle-orm/pg-core";

export const table = pgTable(
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
