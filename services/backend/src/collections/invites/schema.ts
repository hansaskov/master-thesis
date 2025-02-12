import type { PartialExcept } from "$types/strict";
import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { organizations } from "../organizations/schema";
import { users } from "../users/schema";
import { rolesEnum } from "$collections/users_to_organizations/schema";
import { t } from "elysia";

export const invites = pgTable("invites", {
		organization_id: text()
			.notNull()
			.references(() => organizations.id, { onDelete: "cascade" }),
        inviter_id: text()
			.notNull()
			.references(() => users.id),
		email: text()
			.notNull(),
		role: rolesEnum().notNull(),
	},
	(table) => [primaryKey({ columns: [table.organization_id, table.inviter_id] })],
);

export const insertInvitesSchema = createInsertSchema(invites, {
	email: t.String({ minLength: 1, format: "email" }),
});

export const selectInvitesSchema = createSelectSchema(invites, {
    email: t.String({ minLength: 1, format: "email" }),
});


export type Invites = typeof invites.$inferSelect;
export type InvitesNew = typeof invites.$inferInsert;
export type InvitesUpdate = PartialExcept<Invites,"organization_id" | "inviter_id">;
