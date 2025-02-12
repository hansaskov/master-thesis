import { rolesEnum } from "$collections/users_to_organizations/schema";
import type { PartialExcept, StrictPick } from "$types/strict";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { organizations } from "../organizations/schema";
import { users } from "../users/schema";

export const invites = pgTable(
	"invites",
	{
		email: text().notNull(),
		organization_id: text()
			.notNull(),
		inviter_id: text()
			.notNull()
			.references(() => users.id),
		role: rolesEnum().notNull().default("User"),
	},
	(table) => [primaryKey({ columns: [table.email, table.organization_id] })],
);

export const insertInvitesSchema = createInsertSchema(invites, {
	email: t.String({ minLength: 1, format: "email" }),
});

export const selectInvitesSchema = createSelectSchema(invites, {
	email: t.String({ minLength: 1, format: "email" }),
});

export type Invites = typeof invites.$inferSelect;
export type InvitesNew = typeof invites.$inferInsert;
export type InvitesUpdate = PartialExcept<Invites, "organization_id" | "email">;
export type InvitesUnique = StrictPick<Invites, "organization_id" | "email">;
