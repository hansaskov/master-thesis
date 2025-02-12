import { Table } from "$collections/table";
import { db } from "$db/postgres";
import type { Types } from "$types/collection";

import type { StrictPick } from "$types/strict";
import { and, eq, getTableColumns } from "drizzle-orm";

export const usersQueries = {
	selectUniqueWithProvider: async (
		user: StrictPick<Types.User, "provider_name" | "provider_id">,
	) =>
		await db
			.select()
			.from(Table.users)
			.where(
				and(
					eq(Table.users.provider_name, user.provider_name),
					eq(Table.users.provider_id, user.provider_id),
				),
			)
			.then((v) => v.at(0)),
	select: async (user: StrictPick<Types.User, "id">) =>
		await db
			.select()
			.from(Table.users)
			.where(eq(Table.users.id, user.id))
			.then((v) => v.at(0)),
	create: async (user: Types.UserNew) => {
		// Check if this is the first user
		const tableHasNoUsers = await db
			.select()
			.from(Table.users)
			.limit(1)
			.then((v) => v.length === 0);
		if (user.is_superadmin === undefined && tableHasNoUsers) {
			user.is_superadmin = true;
		}

		return await db
			.insert(Table.users)
			.values(user)
			.returning()
			.then((v) => v[0]);
	},
	delete: async (user: StrictPick<Types.User, "id">) =>
		await db.delete(Table.users).where(eq(Table.users.id, user.id)).returning(),
	selectAllOnOrganization: async (
		organization: StrictPick<Types.Organization, "id">,
	) =>
		await db
			.select({
				role: Table.usersToOrganizations.role,
				...getTableColumns(Table.users),
			})
			.from(Table.users)
			.innerJoin(
				Table.usersToOrganizations,
				and(
					eq(Table.users.id, Table.usersToOrganizations.user_id),
					eq(Table.usersToOrganizations.organization_id, organization.id),
				),
			),
};
