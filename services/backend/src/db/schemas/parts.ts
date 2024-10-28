import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { generateRandomString } from ".";

export const parts = pgTable("parts", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(12)),
	name: text().notNull(),
});
