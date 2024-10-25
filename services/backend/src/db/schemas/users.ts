import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const users = pgTable("users", {
	id: uuid().primaryKey().notNull().$default(uuidv7),
	is_superadmin: boolean().notNull().default(false),
	microsoft_id: text(),
});
