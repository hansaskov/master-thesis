import { pgTable, text } from "drizzle-orm/pg-core";
import { generateRandomString, systems } from "./";

export const keys = pgTable("keys", {
	public_id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(22)),
	private_id: text()
		.notNull()
		.references(() => systems.id, { onDelete: "cascade" }),
});
