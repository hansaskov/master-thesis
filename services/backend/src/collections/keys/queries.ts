import { db } from "$db/postgres";
import type { Types } from "$types/collection";
import { and, eq, sql } from "drizzle-orm";
import { keys } from "./schema";

const PreparedselectUnique = db
	.select()
	.from(keys)
	.where(
		and(
			eq(keys.public_key, sql.placeholder("public_key")),
			eq(keys.private_key, sql.placeholder("private_key")),
		),
	)
	.limit(1)
	.prepare("select_unique_Key");

export const keysQueries = {
	select: async (values: Types.Keys) =>
		await PreparedselectUnique.execute(values).then((v) => v.at(0)),
	create: async (values: Types.KeysNew) =>
		await db
			.insert(keys)
			.values(values)
			.returning()
			.then((v) => v[0]),
	createMany: async (values: Types.KeysNew[]) =>
		await db.insert(keys).values(values).returning(),
} as const;
