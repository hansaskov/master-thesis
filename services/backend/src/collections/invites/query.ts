import type { Insert, Select, Unique, Update } from "./types";
import { eq, and, sql } from "drizzle-orm";
import { db } from "$db/postgres";
import { table } from "./table";
import { Organization } from "$collections/organizations";

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

export async function selectInvitesOnOrganization(
	organization: Organization.Unique,
) {
	return await db
		.select()
		.from(table)
		.where(eq(table.organization_id, organization.id));
}

export async function selectOnEmailAndOrganization({
	organization_id,
	email,
}: { organization_id: string; email: string }) {
	return await db
		.select()
		.from(table)
		.where(
			and(eq(table.organization_id, organization_id), eq(table.email, email)),
		)
		.limit(1)
		.then((v) => v.at(0));
}

export async function selectOnPrimaryId({ id }: { id: string }) {
	return await db
		.select()
		.from(table)
		.where(eq(table.id, id))
		.limit(1)
		.then((v) => v.at(0));
}
