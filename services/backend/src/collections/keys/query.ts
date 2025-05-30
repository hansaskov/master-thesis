import type { Insert, Select, Unique, Update } from "./types";
import { eq, and, sql } from "drizzle-orm";
import { db } from "$db/postgres";
import { table } from "./table";
import { System } from "$collections/systems";

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

export async function selectAllOnSystem(system: System.Unique) {
	return await db
		.select({
			id: table.id,
			name: table.name,
			created_at: table.created_at,
			public_key: table.system_id,
		})
		.from(table)
		.where(eq(table.system_id, system.id));
}

const PreparedselectUnique = db
	.select()
	.from(table)
	.where(eq(table.private_key, sql.placeholder("private_key")))
	.limit(1)
	.prepare("select_unique_Key");

export async function select(values: { private_key: string }) {
	return await PreparedselectUnique.execute(values).then((v) => v.at(0));
}
