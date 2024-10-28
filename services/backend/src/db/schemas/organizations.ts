import { pgTable, text } from "drizzle-orm/pg-core";
import { generateRandomString } from ".";

export const organizations = pgTable("organizations", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(12)),
	name: text().notNull(),
});
