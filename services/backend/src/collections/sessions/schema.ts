import type { PartialExcept } from "$types/strict";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";
import { users } from "../users/schema";

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

export type Session = typeof sessions.$inferSelect;
export type SessionNew = typeof sessions.$inferInsert;
export type SessionUpdate = PartialExcept<Session, "id">;
