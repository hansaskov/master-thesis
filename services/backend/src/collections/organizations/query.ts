import type { Insert, Select, Unique, Update } from "./types";
import { and, eq, getTableColumns } from "drizzle-orm";
import { db } from "$db/postgres";
import { table } from "./table";
import { c } from "..";

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

export async function selectFirst() {
	return await db
		.select()
		.from(table)
		.limit(1)
		.then((v) => v.at(0));
}

export async function selectAll() {
	return await db.select().from(table);
}

export async function remove({ id }: Unique) {
	return await db
		.delete(table)
		.where(eq(table.id, id))
		.returning()
		.then((v) => v.at(0));
}

export async function update(values: Update) {
	return await db
		.update(table)
		.set(values)
		.where(eq(table.id, values.id))
		.returning()
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

export async function selectOrganizationsOnUser(user_id: string) {
	return await db
		.select({
			userRole: c.usersToOrganizations.table.role,
			...getTableColumns(table),
		})
		.from(c.usersToOrganizations.table)
		.innerJoin(
			table,
			and(
				eq(c.usersToOrganizations.table.organization_id, table.id),
				eq(c.usersToOrganizations.table.user_id, user_id),
			),
		);
}
