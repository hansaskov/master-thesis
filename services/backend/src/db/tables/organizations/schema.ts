import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";
import { Prettify } from "elysia/types";
import { StrictOmit, StrictPartial, StrictPick } from "../../../types/strict";
import { generateRandomString } from "../../utils";

export const organizations = pgTable("organizations", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(12)),
	name: text().notNull(),
});

export const insertOrganizationsSchema = createInsertSchema(organizations, {
	name: t.String({ minLength: 4 }),
});

export type Organizations = typeof organizations.$inferSelect;
export type OrganizationsNew = typeof organizations.$inferInsert;
