import { generateRandomString } from "$utils/random";
import { pgTable, text } from "drizzle-orm/pg-core";

export const table = pgTable("organizations", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(12)),
	name: text().notNull(),
});
