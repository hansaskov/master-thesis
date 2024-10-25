import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { uuidv7 } from "uuidv7";

export const systemModels = pgTable("system_models", {
	id: uuid().primaryKey().notNull().$default(uuidv7),
	name: text().notNull(),
});

export const insertSystemModelsSchema = createInsertSchema(systemModels);
export const SelectSystemModelsSchema = createSelectSchema(systemModels);

export type InsterSystemModel = typeof systemModels.$inferInsert

