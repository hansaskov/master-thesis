import type { PartialExcept } from "$types/strict";
import { generateRandomString } from "$utils/random";
import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";
import { systemModelEnum } from "../systems/schema";
export const systemModels = pgTable("system_models", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(12)),
	name: systemModelEnum().notNull(),
});

export const insertSystemModelsSchema = createInsertSchema(systemModels, {
	id: t.String({ minLength: 12 }),
	name: t.String({ minLength: 1 }),
});

export type SystemModel = typeof systemModels.$inferSelect;
export type SystemModelNew = typeof systemModels.$inferInsert;
export type SystemModelUpdate = PartialExcept<SystemModel, "id">;
