import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./";

export const sessions = pgTable("sessions", {
	id: text().primaryKey().notNull(),
	user_id: uuid()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires_at: timestamp({ mode: "string" }).notNull(),
});
