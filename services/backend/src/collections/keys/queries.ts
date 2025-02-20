import { db } from "$db/postgres";
import type { Types } from "$types/collection";
import { and, eq, sql } from "drizzle-orm";
import { keys } from "./schema";

const PreparedselectUnique = db
	.select()
	.from(keys)
	.where(
		eq(keys.private_key, sql.placeholder("private_key")),
	)
	.limit(1)
	.prepare("select_unique_Key");

export const keysQueries = {
	select: async (values: Types.KeysUnique) =>
		await PreparedselectUnique.execute(values).then((v) => v.at(0)),
	selectAllOnSystem: async (system: Types.SystemUnique) =>
		await db
			.select({
				name: keys.name,
				created_at: keys.created_at,
				public_key: keys.system_id,
			})
			.from(keys)
			.where(eq(keys.system_id, system.id)),
	create: async (values: Types.KeysNew) =>
		await db
			.insert(keys)
			.values(values)
			.returning()
			.then((v) => v[0]),
	createMany: async (values: Types.KeysNew[]) =>
		await db.insert(keys).values(values).returning(),
} as const;
