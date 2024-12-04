import { and, eq } from "drizzle-orm";
import { Prettify } from "elysia/types";
import {
	type Types,
	type User,
	type UserNew,
	organizations,
	users,
	usersToOrganizations,
} from "..";
import type { StrictPick } from "../../../types/strict";
import { Table } from "../../model";
import { db } from "../../postgres";

export const organizationQueries = {
	delete: async ({ id }: StrictPick<Types.Organization, "id">) =>
		await db.delete(organizations).where(eq(organizations.id, id)),
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
	selectOrganizationsOnUser: async (user: StrictPick<User, "id">) =>
		await db
			.select({
				id: organizations.id,
				name: organizations.name,
				userRole: usersToOrganizations.role,
			})
			.from(usersToOrganizations)
			.innerJoin(
				organizations,
				eq(usersToOrganizations.organization_id, organizations.id),
			)
			.innerJoin(users, eq(usersToOrganizations.user_id, users.id))
			.where(
				and(eq(users.id, user.id), eq(usersToOrganizations.user_id, user.id)),
			),
};
