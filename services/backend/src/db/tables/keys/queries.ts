import { and, eq, sql } from "drizzle-orm";
import { keys } from "..";
import { db } from "../../postgres";

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
	}: typeof keys.$inferSelect) {
		return await PreparedselectUnique.execute({ private_key, public_key }).then(
			(v) => v.at(0),
		);
	},
} as const;
