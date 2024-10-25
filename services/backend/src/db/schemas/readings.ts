import { doublePrecision, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { systems } from "./";

export const readings = pgTable(
	"readings",
	{
		time: timestamp({ withTimezone: true, mode: "string" }).notNull(),
		systems_id: uuid()
			.notNull()
			.references(() => systems.id, { onDelete: "cascade" }),
		name: text().notNull(),
		value: doublePrecision().notNull(),
		unit: text().notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.time, table.systems_id, table.name] }),
	}),
);
