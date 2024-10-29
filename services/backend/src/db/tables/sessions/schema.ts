import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";
import { users } from "..";

export const sessions = pgTable("sessions", {
	id: text().primaryKey().notNull(),
	user_id: text()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires_at: timestamp({ mode: "date" }).notNull(),
});

export const insertSessionsSchema = createInsertSchema(sessions, {
	user_id: t.String({ minLength: 1 }),
	expires_at: t.String({ format: "date" }),
});
