import { and, eq } from "drizzle-orm";
import { Prettify } from "elysia/types";
import {
	type Organizations,
	type OrganizationsNew,
	type OrganizationsUpdate,
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
	delete: async ({ id }: StrictPick<Organizations, "id">) => {
		db.delete(organizations).where(eq(organizations.id, id));
	},
	create: async (values: OrganizationsNew) => {
		db.insert(organizations).values(values);
	},
	update: async (values: OrganizationsUpdate) => {
		db.update(organizations).set(values).where(eq(organizations.id, values.id));
	},
	selectOrganizationOnUser: async (user: StrictPick<User, "id">) => {
		return db
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
			);
	},
};
