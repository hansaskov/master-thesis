import { db } from "$db/postgres";
import type { Types } from "$types/collection";
import type { StrictPick } from "$types/strict";
import { and, eq } from "drizzle-orm";
import { usersToOrganizations } from "../users_to_organizations/schema";
import { organizations } from "./schema";

export const organizationQueries = {
	delete: async ({ id }: StrictPick<Types.Organization, "id">) =>
		await db
			.delete(organizations)
			.where(eq(organizations.id, id))
			.returning()
			.then((v) => v.at(0)),
	create: async (values: Types.OrganizationNew) =>
		await db
			.insert(organizations)
			.values(values)
			.returning()
			.then((v) => v[0]),
	update: async (values: Types.OrganizationUpdate) =>
		await db
			.update(organizations)
			.set(values)
			.where(eq(organizations.id, values.id))
			.returning()
			.then((v) => v.at(0)),
	selectAll: async () => await db.select().from(organizations),
	selectOrganizationsOnUser: async (user: StrictPick<Types.User, "id">) =>
		await db
			.select({
				id: organizations.id,
				name: organizations.name,
				userRole: usersToOrganizations.role,
			})
			.from(usersToOrganizations)
			.innerJoin(
				organizations,
				and(
					eq(usersToOrganizations.organization_id, organizations.id),
					eq(usersToOrganizations.user_id, user.id),
				),
			),
};
