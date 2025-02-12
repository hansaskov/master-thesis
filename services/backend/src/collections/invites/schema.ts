import type { PartialExcept } from "$types/strict";
import { pgEnum, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-typebox";
import { organizations } from "../organizations/schema";
import { users } from "../users/schema";
import { rolesEnum } from "$collections/users_to_organizations/schema";

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

export const insertUserToOrganizationSchema =
	createInsertSchema(invites);

export type UserToOrganization = typeof invites.$inferSelect;
export type UserToOrganizationNew = typeof invites.$inferInsert;
export type UserToOrganizationUpdate = PartialExcept<UserToOrganization,"organization_id" | "inviter_id">;
