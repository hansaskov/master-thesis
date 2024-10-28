import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { generateRandomString } from ".";
import { users } from "./users";

export const userSettings = pgTable("user_settings", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(12)),
	theme: text().notNull(),
	product_updates: boolean().notNull(),
	user_id: text()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
});
