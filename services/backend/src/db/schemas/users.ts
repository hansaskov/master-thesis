import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { generateRandomString } from ".";

export const users = pgTable("users", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(12)),
	is_superadmin: boolean().notNull().default(false),
	microsoft_id: text(),
});
