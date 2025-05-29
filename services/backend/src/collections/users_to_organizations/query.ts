import type { Insert, Select, Unique } from "./types";
import { and, eq } from "drizzle-orm";
import { db } from "$db/postgres";
import { table } from "./table";
import { Prettify } from "elysia/types";

export async function insertMany(values: Insert[]) {
	return await db.insert(table).values(values).returning();
}

export async function insertOne(values: Insert) {
	return await db
		.insert(table)
		.values(values)
		.returning()
		.then((v) => v[0]);
}
export async function selectAll() {
	return await db.select().from(table);
}

export async function selectFirst() {
	return await db
		.select()
		.from(table)
		.limit(1)
		.then((v) => v[0] as Select);
}

export async function remove({ user_id, organization_id }: Unique) {
	return await db
		.delete(table)
		.where(
			and(
				eq(table.user_id, user_id),
				eq(table.organization_id, organization_id),
			),
		)
		.returning()
		.then((v) => v[0] as Select);
}
