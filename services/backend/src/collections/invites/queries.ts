import { Table } from "$collections/table";
import { db } from "$db/postgres";
import type { Types } from "$types/collection";
import { and, eq } from "drizzle-orm";

export const invitesQueries = {
	delete: async (values: Types.InvitesUnique) =>
		await db
			.delete(Table.invites)
			.where(
				and(
					eq(Table.invites.organization_id, values.organization_id),
					eq(Table.invites.email, values.email),
				),
			)
			.returning()
			.then((v) => v.at(0)),
	create: async (values: Types.InvitesNew) =>
		await db
			.insert(Table.invites)
			.values(values)
			.returning()
			.then((v) => v[0]),
	update: async (values: Types.InvitesUpdate) =>
		await db
			.update(Table.invites)
			.set(values)
			.where(
				and(
					eq(Table.invites.organization_id, values.organization_id),
					eq(Table.invites.email, values.email),
				),
			)
			.returning()
			.then((v) => v.at(0)),
	selectAll: async () => await db.select().from(Table.invites),
	selectInvitesOnOrganization: async (organization: Types.OrganizationUnique) =>
		await db
			.select()
			.from(Table.invites)
			.where(eq(Table.invites.organization_id, organization.id)),
	selectOnEmailAndOrganization: async ({
		organization_id,
		email,
	}: { organization_id: string; email: string }) =>
		await db
			.select()
			.from(Table.invites)
			.where(
				and(
					eq(Table.invites.organization_id, organization_id),
					eq(Table.invites.email, email),
				),
			)
			.limit(1)
			.then((v) => v.at(0)),
	selectOnPrimaryId: async ({ id }: { id: string }) =>
		await db
			.select()
			.from(Table.invites)
			.where(eq(Table.invites.id, id))
			.limit(1)
			.then((v) => v.at(0)),
};
