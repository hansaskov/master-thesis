import { generateRandomString } from "$utils/random";
import { pgTable, index, text, timestamp } from "drizzle-orm/pg-core";
import { table as systems } from "../systems/table";

export const table = pgTable(
	"keys",
	{
		id: text()
			.primaryKey()
			.$default(() => generateRandomString(12))
			.notNull(),
		private_key: text()
			.$default(() => generateRandomString(22))
			.notNull()
			.unique(),
		system_id: text()
			.notNull()
			.references(() => systems.id, { onDelete: "cascade" }),
		name: text().notNull(),
		created_at: timestamp({ mode: "date" })
			.notNull()
			.$default(() => new Date()),
	},
	(table) => [index().on(table.private_key, table.system_id)],
);
