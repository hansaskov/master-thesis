import { db } from "$db/postgres";
import type { Types } from "$types/index";
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
	selectUnique: async function selectUnique({
		private_key,
		public_key,
	}: Types.Keys) {
		return await PreparedselectUnique.execute({ private_key, public_key }).then(
			(v) => v.at(0),
		);
	},
} as const;
