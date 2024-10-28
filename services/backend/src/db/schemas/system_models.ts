import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { generateRandomString } from ".";

export const systemModels = pgTable("system_models", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(8)),
	name: text().notNull(),
});

export const insertSystemModelsSchema = createInsertSchema(systemModels, {
	id: t.String({ minLength: 12 }),
	name: t.String({ minLength: 1 }),
});
