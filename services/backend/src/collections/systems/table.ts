import { generateRandomString } from "$utils/random";
import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { table as organizations } from "../organizations/table";

export const table = pgTable("systems", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(12)),
	name: text().notNull(),
	organization_id: text()
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	system_model: text().notNull(),
	is_template: boolean().notNull().default(false),
});
