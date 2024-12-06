import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";
import { generateRandomString } from "../../utils";
import { PartialExcept } from "../../../types/strict";

export const parts = pgTable("parts", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(12)),
	name: text().notNull(),
});

export const insertPartsSchema = createInsertSchema(parts, {
	name: t.String({ minLength: 1 }),
});

export type Part = typeof parts.$inferSelect;
export type PartNew = typeof parts.$inferInsert;
export type PartUpdate = PartialExcept<Part, "id">;

