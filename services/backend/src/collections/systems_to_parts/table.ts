import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { table as parts } from "../parts/table";
import { table as systems } from "../systems/table";

export const table = pgTable(
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
