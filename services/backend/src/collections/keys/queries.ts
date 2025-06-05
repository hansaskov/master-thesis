import { db } from "$db/postgres";
import type { Types } from "$types/collection";
import { and, eq, sql } from "drizzle-orm";
import { keys } from "./schema";
import cache from "./cache";

const PreparedselectUnique = db
	.select()
	.from(keys)
	.where(eq(keys.private_key, sql.placeholder("private_key")))
	.limit(1)
	.prepare("select_unique_Key");

export const keysQueries = {
	select: async (values: Types.KeysUnique) => {
	
		const cachedKey = await cache.get(values)

		if (cachedKey) {
			return cachedKey
		}

		const key = await PreparedselectUnique.execute(values).then((v) => v.at(0))

		if (key) {
			await cache.set(key)
		}
		
		return key
	},
	selectAllOnSystem: async (system: Types.SystemUnique) =>
		await db
			.select({
				id: keys.id,
				name: keys.name,
				created_at: keys.created_at,
				public_key: keys.system_id,
			})
			.from(keys)
			.where(eq(keys.system_id, system.id)),
	create: async (values: Types.KeysNew) => {
	
		 const key = await db
			.insert(keys)
			.values(values)
			.returning()
			.then((v) => v[0])


		await cache.set(key)

		return key

		},

	createMany: async (values: Types.KeysNew[]) =>
		await db.insert(keys).values(values).returning(),
	delete: async ({ id }: { id: string }) => {
		await db
			.delete(keys)
			.where(eq(keys.id, id))
			.returning()
			.then((t) => t.at(0));
	},
} as const;
