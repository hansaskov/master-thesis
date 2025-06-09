import { Table } from "$collections/table";
import { db } from "$db/postgres";
import type { Types } from "$types/collection";
import type { StrictPick } from "$types/strict";
import { and, eq, getTableColumns } from "drizzle-orm";
import { users } from "./schema";

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
	getAllSuperAdmins: async () =>
		await db
			.select()
			.from(Table.users)
			.where(eq(Table.users.is_superadmin, true)),
	selectOneOnOrganization: async (
		organization: Types.OrganizationUnique,
		user: Types.UserUnique,
	) =>
		await db
			.select({
				...getTableColumns(Table.users),
			})
			.from(Table.users)
			.innerJoin(
				Table.usersToOrganizations,
				and(
					eq(Table.users.id, Table.usersToOrganizations.user_id),
					eq(Table.usersToOrganizations.organization_id, organization.id),
					eq(Table.users.id, user.id),
				),
			)
			.limit(1)
			.then((v) => v.at(0)),
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
	selectAll: async () => db.select().from(users),
	updateSuperadminField: async (id: string, newValue: boolean) =>
		await db
			.update(Table.users)
			.set({
				is_superadmin: newValue,
			})
			.where(eq(Table.users.id, id)),
	updateName: async (id: string, newName: string) =>
		await db
			.update(Table.users)
			.set({
				name: newName,
			})
			.where(eq(Table.users.id, id)),
	updateMail: async (id: string, newMail: string) =>
		await db
			.update(Table.users)
			.set({
				email: newMail,
			})
			.where(eq(Table.users.id, id)),
	updateImage: async (id: string, newImage: string) =>
		await db
			.update(Table.users)
			.set({
				image: newImage,
			})
			.where(eq(Table.users.id, id)),
	selectAllRelated: async (userId: string) => {
		// 1) The user row itself
		const userRow = await db
			.select()
			.from(Table.users)
			.where(eq(Table.users.id, userId))
			.then((rows) => rows.at(0));

		// 2) All sessions (session.user_id = userId)
		const userSessions = await db
			.select()
			.from(Table.sessions)
			.where(eq(Table.sessions.user_id, userId));

		// 3) All “users_to_organizations” plus the joined organization record
		//    We alias the columns so it’s easier to consume on the frontend.
		const memberships = await db
			.select({
				membershipId: Table.usersToOrganizations.user_id,
				organizationId: Table.usersToOrganizations.organization_id,
				role: Table.usersToOrganizations.role,
				orgName: Table.organizations.name,
				orgRow: Table.organizations, // the entire organization row
			})
			.from(Table.usersToOrganizations)
			.leftJoin(
				Table.organizations,
				eq(Table.usersToOrganizations.organization_id, Table.organizations.id),
			)
			.where(eq(Table.usersToOrganizations.user_id, userId));

		// 4) All invites where this user is the “inviter”
		const sentInvites = await db
			.select()
			.from(Table.invites)
			.where(eq(Table.invites.inviter_id, userId));

		return {
			user: userRow,
			sessions: userSessions,
			memberships: memberships.map((m) => ({
				id: m.membershipId,
				organization: {
					id: m.organizationId,
					name: m.orgName,
					...m.orgRow, // contains all organization columns
				},
				role: m.role,
			})),
			invites: sentInvites,
		};
	},
};
