import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";
import { organizations } from "..";
import type { PartialExcept } from "../../../types/strict";
import { generateRandomString } from "../../utils";

const LENGTH = 12;

export const factoryAreas = pgTable("factory_areas", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(LENGTH)),
	name: text().notNull(),
	organization_id: text()
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
});

export const insertFactoryAreaSchema = createInsertSchema(factoryAreas, {
	id: t.String({ minLength: LENGTH }),
	name: t.String({ minLength: 1 }),
	organization_id: t.String({ minLength: 1 }),
});

export type factoryArea = typeof factoryAreas.$inferSelect;
export type factoryAreasNew = typeof factoryAreas.$inferInsert;
export type factoryAreaUpdate = PartialExcept<factoryArea, "id">;
