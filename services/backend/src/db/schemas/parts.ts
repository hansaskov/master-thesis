import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const parts = pgTable("parts", {
	id: uuid().primaryKey().notNull().$default(uuidv7),
	name: text().notNull(),
});
