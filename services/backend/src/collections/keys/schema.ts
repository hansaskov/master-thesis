import type { StrictPick } from "$types/strict";
import { generateRandomString } from "$utils/random";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { systems } from "../systems/schema";

export const keys = pgTable("keys", {
	private_key: text()
		.primaryKey()
		.$default(() => generateRandomString(22))
		.notNull(),
	system_id: text()
		.notNull()
		.references(() => systems.id, { onDelete: "cascade" }),
	name: text().notNull(),
	created_at: timestamp({ mode: "date" })
		.notNull()
		.$default(() => new Date()),
});

export const insertKeysSchema = createInsertSchema(keys, {
	system_id: t.String({ minLength: 1 }),
	private_key: t.String({ minLength: 1 }),
});

export const selectKeysSchema = createSelectSchema(keys);

export type Keys = typeof keys.$inferSelect;
export type KeysNew = typeof keys.$inferInsert;
export type KeysUnique = StrictPick<Keys, "private_key">;
