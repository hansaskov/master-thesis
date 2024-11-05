import { and, eq, sql } from "drizzle-orm";
import { keys } from "..";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";


async function selectUnique(db: PostgresJsDatabase, { private_key, public_key }: typeof keys.$inferSelect) {
	return db
	.select()
	.from(keys)
	.where(and(eq(keys.public_key, public_key), eq(keys.private_key, private_key)))
	.limit(1)
	.then((v) => v.at(0))
}

export const keysQueries = {
	selectUnique,
};
