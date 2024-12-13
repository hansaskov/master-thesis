import { generateRandomString } from "$utils/random";
import { boolean, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";
import type { PartialExcept } from "../../../types/strict";

export const providerEnum = pgEnum("providers", ["Github", "Microsoft"]);

export const users = pgTable("users", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(12)),
	is_superadmin: boolean().notNull().default(false),
	provider_name: providerEnum().notNull(),
	provider_id: text().notNull(),
});

export const insertUserSchema = createInsertSchema(users, {
	id: t.String({ minLength: 12 }),
});

export type User = typeof users.$inferSelect;
export type UserNew = typeof users.$inferInsert;
export type UserUpdate = PartialExcept<User, "id">;
