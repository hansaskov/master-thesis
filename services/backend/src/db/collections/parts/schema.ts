import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import type { PartialExcept } from "../../../types/strict";
import { generateRandomString } from "../../../utils/random";

export const parts = pgTable("parts", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(12)),
	name: text().notNull(),
});

export const selectPartsSchema = createSelectSchema(parts);
export const insertPartsSchema = createInsertSchema(parts, {
	name: t.String({ minLength: 1 }),
});

export type Part = typeof parts.$inferSelect;
export type PartNew = typeof parts.$inferInsert;
export type PartUpdate = PartialExcept<Part, "id">;
