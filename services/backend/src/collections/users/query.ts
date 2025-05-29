import { db } from "$db/postgres";
import type { Types } from "$types/collection";

import type { StrictPick } from "$types/strict";
import { and, eq, getTableColumns } from "drizzle-orm";
import { table } from "./table";
import type { Insert, Unique, Update } from "./types";
import { c } from "..";

// ------ SELECT --------

export async function selectAll() {
	return await db.select().from(table);
}

export async function selectFirst() {
	return await db
		.select()
		.from(table)
		.limit(1)
		.then((v) => v.at(0));
}

export async function selectUnique(id: string) {
	return await db
		.select()
		.from(table)
		.where(eq(table.id, id))
		.limit(1)
		.then((v) => v.at(0));
}

// ------ INSERT --------

export async function insertOne(values: Insert) {
	return await db
		.insert(table)
		.values(values)
		.returning()
		.then((v) => v[0]);
}

export async function insertMany(values: Insert[]) {
	return await db.insert(table).values(values).returning();
}

// ------ UPDATE --------

export async function update(values: Update) {
	return await db
		.update(table)
		.set(values)
		.where(eq(table.id, values.id))
		.returning()
		.then((v) => v.at(0));
}

// ------ DELETE --------

export async function remove({ id }: Unique) {
	return await db
		.delete(table)
		.where(eq(table.id, id))
		.returning()
		.then((v) => v.at(0));
}

// ------ OTHERS --------

export async function selectUniqueWithProvider(
	user: StrictPick<Types.User, "provider_name" | "provider_id">,
) {
	return await db
		.select()
		.from(table)
		.where(
			and(
				eq(table.provider_name, user.provider_name),
				eq(table.provider_id, user.provider_id),
			),
		)
		.then((v) => v.at(0));
}

export async function getAllSuperAdmins() {
	return await db.select().from(table).where(eq(table.is_superadmin, true));
}

export async function selectOneOnOrganization(
	organization: Types.OrganizationUnique,
	user: Types.UserUnique,
) {
	return await db
		.select({
			...getTableColumns(table),
		})
		.from(table)
		.innerJoin(
			c.usersToOrganizations.table,
			and(
				eq(table.id, c.usersToOrganizations.table.user_id),
				eq(c.usersToOrganizations.table.organization_id, organization.id),
				eq(table.id, user.id),
			),
		)
		.limit(1)
		.then((v) => v.at(0));
}

export async function selectAllOnOrganization(
	organization: StrictPick<Types.Organization, "id">,
) {
	return await db
		.select({
			role: c.usersToOrganizations.table.role,
			...getTableColumns(table),
		})
		.from(table)
		.innerJoin(
			c.usersToOrganizations.table,
			and(
				eq(table.id, c.usersToOrganizations.table.user_id),
				eq(c.usersToOrganizations.table.organization_id, organization.id),
			),
		);
}
export async function updateSuperadminField(id: string, newValue: boolean) {
	return await db
		.update(table)
		.set({
			is_superadmin: newValue,
		})
		.where(eq(table.id, id));
}
