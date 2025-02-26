import type { PartialExcept, StrictPick } from "$types/strict";
import { generateRandomString } from "$utils/random";
import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";

export const organizations = pgTable("organizations", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(12)),
	name: text().notNull(),
});

export const insertOrganizationsSchema = createInsertSchema(organizations, {
	name: t.String({ minLength: 1 }),
});

export const selectOrganizationsSchema = createSelectSchema(organizations);
export const updateOrganizationsSchema = createSelectSchema(organizations, {
	name: t.Optional(t.String()),
});

export type Organization = typeof organizations.$inferSelect;
export type OrganizationNew = typeof organizations.$inferInsert;
export type OrganizationUpdate = PartialExcept<Organization, "id">;
export type OrganizationUnique = StrictPick<Organization, "id">;
