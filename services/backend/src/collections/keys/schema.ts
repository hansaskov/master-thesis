import type { StrictPick, PartialExcept } from "$types/strict";
import { generateRandomString } from "$utils/random";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { systems } from "../systems/schema";

export const keys = pgTable("keys", {
	id: text()
		.primaryKey()
		.$default(() => generateRandomString(12))
		.notNull(),
	private_key: text()
		.$default(() => generateRandomString(22))
		.notNull()
		.unique(),
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
export type KeysUpdate = PartialExcept<Keys, "private_key">;
