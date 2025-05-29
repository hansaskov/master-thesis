import type { Insert, Select, Unique, Update } from "./types";
import { eq, and, sql } from "drizzle-orm";
import { db } from "$db/postgres";
import { table } from "./table";
import { System } from "$collections/systems";
import { SystemsToParts } from "$collections/systems_to_parts";
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

export async function getBySystem(id: string) {
	return await db
		.select()
		.from(table)
		.innerJoin(
			c.systemToParts.table,
			eq(table.id, c.systemToParts.table.parts_id),
		)
		.where(eq(c.systemToParts.table.system_id, id));
}
