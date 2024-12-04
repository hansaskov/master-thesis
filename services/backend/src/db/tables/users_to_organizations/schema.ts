import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { organizations, users } from "..";
import type { PartialExcept } from "../../../types/strict";

export const usersToOrganizations = pgTable(
	"users_to_organizations",
	{
		organization_id: text()
			.notNull()
			.references(() => organizations.id, { onDelete: "cascade" }),
		user_id: text()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		role: text().notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.organization_id, table.user_id] }),
	}),
);

export type UserToOrganization = typeof usersToOrganizations.$inferSelect;
export type UserToOrganizationNew = typeof usersToOrganizations.$inferInsert;
export type UserToOrganizationUpdate = PartialExcept<
	UserToOrganization,
	"organization_id" | "user_id"
>;
