import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { systems } from "./";

export const keys = pgTable("keys", {
	id: uuid().primaryKey().notNull().defaultRandom(),
	public_key: uuid().notNull(),
	system_id: uuid()
		.notNull()
		.references(() => systems.id, { onDelete: "cascade" }),
});
