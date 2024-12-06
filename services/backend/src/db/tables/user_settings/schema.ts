import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";
import { users } from "..";
import type { PartialExcept } from "../../../types/strict";
import { generateRandomString } from "../../utils";

export const userSettings = pgTable("user_settings", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(12)),
	theme: text().notNull(),
	product_updates: boolean().notNull(),
	user_id: text()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
});

export const insertUserSettingsSchema = createInsertSchema(userSettings, {
	id: t.String({ minLength: 12 }),
	theme: t.String({ minLength: 1 }),
	user_id: t.String({ minLength: 12 }),
});

export type UserSettings = typeof userSettings.$inferSelect;
export type UserSettingsNew = typeof userSettings.$inferInsert;
export type UserSettingsUpdate = PartialExcept<UserSettings, "id">;
