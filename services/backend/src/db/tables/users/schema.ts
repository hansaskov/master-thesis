import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";
import { Prettify, StrictOmit, StrictPick } from "../../../types/strict";
import { generateRandomString } from "../../utils";

export const users = pgTable("users", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(12)),
	is_superadmin: boolean().notNull().default(false),
	microsoft_id: text(),
});

export const insertUserSchema = createInsertSchema(users, {
	id: t.String({ minLength: 12 }),
});

export type User = typeof users.$inferSelect;
export type UserNew = typeof users.$inferInsert;
