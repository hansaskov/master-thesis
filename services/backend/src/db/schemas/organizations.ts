import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const organizations = pgTable("organizations", {
	id: uuid().primaryKey().notNull().$default(uuidv7),
	name: text().notNull(),
});
