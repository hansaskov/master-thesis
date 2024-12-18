import { pgEnum, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-typebox";
import type { PartialExcept } from "../../../types/strict";
import { organizations } from "../organizations/schema";
import { users } from "../users/schema";

export const rolesEnum = pgEnum("users_to_provider_roles", ["Admin", "User"]);

export const usersToOrganizations = pgTable(
	"users_to_organizations",
	{
		organization_id: text()
			.notNull()
			.references(() => organizations.id, { onDelete: "cascade" }),
		user_id: text()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		role: rolesEnum().notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.organization_id, table.user_id] }),
	}),
);

export const insertUserToOrganizationSchema =
	createInsertSchema(usersToOrganizations);

export type UserToOrganization = typeof usersToOrganizations.$inferSelect;
export type UserToOrganizationNew = typeof usersToOrganizations.$inferInsert;
export type UserToOrganizationUpdate = PartialExcept<
	UserToOrganization,
	"organization_id" | "user_id"
>;
