import type { PartialExcept, StrictPick } from "$types/strict";
import { generateRandomString } from "$utils/random";
import { boolean, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";

export const providerEnum = pgEnum("providers", ["Github", "Microsoft"]);

export const users = pgTable("users", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(12)),
	is_superadmin: boolean().notNull().default(false),
	name: text().notNull(),
	email: text(),
	email_verified: boolean().notNull().default(false),
	image: text(),
	provider_name: providerEnum().notNull(),
	provider_id: text().notNull(),
});

export const insertUserSchema = createInsertSchema(users, {
	id: t.String({ minLength: 12 }),
});
export const selectUserSchema = createInsertSchema(users, {
	id: t.String({ minLength: 12 }),
});

export type User = typeof users.$inferSelect;
export type UserNew = typeof users.$inferInsert;
export type UserUpdate = PartialExcept<User, "id">;
export type UserUnique = StrictPick<User, "id">;
