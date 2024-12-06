import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { systems } from "..";
import { PartialExcept } from "../../../types/strict";
import { generateRandomString } from "../../utils";

export const keys = pgTable("keys", {
	public_key: text()
		.primaryKey()
		.$default(() => generateRandomString(22))
		.notNull(),
	private_key: text()
		.notNull()
		.references(() => systems.id, { onDelete: "cascade" }),
});

keys.public_key;

export const insertKeysSchema = createInsertSchema(keys, {
	public_key: t.String({ minLength: 1 }),
	private_key: t.String({ minLength: 1 }),
});

export const selectKeysSchema = createSelectSchema(keys);

export type Keys = typeof keys.$inferSelect;
export type KeysNew = typeof keys.$inferInsert;
