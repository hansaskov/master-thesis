import { generateRandomString } from "$utils/random";
import { pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { systemModels } from "..";
import type { PartialExcept } from "../../../types/strict";
import { organizations } from "../organizations/schema";

export const systemModelEnum = pgEnum("system_models_enum", [
	"VisioPointer",
	"VisioCompact",
	"VisioLine",
	"SmartInspector",
	"360 Inspector",
	"VisioOne",
	"IML-Inspector",
]);

export const systems = pgTable("systems", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(12)),
	name: text().notNull(),
	organization_id: text()
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	system_model: systemModelEnum().notNull(),
});

export const insertSystemsSchema = createInsertSchema(systems, {
	id: t.String({ minLength: 12 }),
	name: t.String({ minLength: 1 }),
	organization_id: t.String({ minLength: 1 }),
});

export const selectSystemsSchema = createSelectSchema(systems);

export type System = typeof systems.$inferSelect;
export type SystemNew = typeof systems.$inferInsert;
export type SystemUpdate = PartialExcept<System, "id">;
