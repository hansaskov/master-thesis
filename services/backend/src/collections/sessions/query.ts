import type { Insert, Select, Unique, Update } from "./types";
import { eq, sql } from "drizzle-orm";
import { db } from "$db/postgres";
import { table } from "./table";

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
import { table as users } from "../users";
import { table as sessions } from "./table";

const prepareSelectUniqueWithUser = db
	.select({ user: users, session: sessions })
	.from(table)
	.innerJoin(users, eq(sessions.user_id, users.id))
	.where(eq(sessions.id, sql.placeholder("sessionId")))
	.prepare("select_with_user");

export async function selectWithUser(sessionId: string) {
	return await prepareSelectUniqueWithUser
		.execute({ sessionId })
		.then((v) => v.at(0));
}
