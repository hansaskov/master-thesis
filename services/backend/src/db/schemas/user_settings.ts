import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { users } from "./users";

export const userSettings = pgTable("user_settings", {
	id: uuid().primaryKey().notNull().$default(uuidv7),
	theme: text().notNull(),
	product_updates: boolean().notNull(),
	user_id: uuid()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
});
