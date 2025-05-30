import {
	pgTable,
	primaryKey,
	real,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { table as systems } from "../systems/table";

export const table = pgTable(
	"readings",
	{
		system_id: text()
			.notNull()
			.references(() => systems.id, { onDelete: "cascade" }),
		category: text().notNull().default("Others"),
		unit: text().notNull(),
		name: text().notNull(),
		time: timestamp({ withTimezone: true, mode: "date" }).notNull(),
		value: real().notNull(),
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
