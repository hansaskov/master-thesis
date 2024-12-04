import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { Prettify } from "elysia/types";
import {
	StrictOmit,
	type StrictPartial,
	StrictPick,
} from "../../../types/strict";
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

export const selectOrganizationsSchema = createSelectSchema(organizations);
export const updateOrganizationsSchema = createSelectSchema(organizations, {
	name: t.Optional(t.String()),
});

export namespace Types {
	export namespace Organization {
		export type Select = typeof organizations.$inferSelect;
		export type New = typeof organizations.$inferInsert;
		export type Update = StrictPartial<Select, "name">;
	}
}
