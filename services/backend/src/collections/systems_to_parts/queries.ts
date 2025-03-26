import { db } from "$db/postgres";
import type { Types } from "$types/collection";
import type { StrictPick } from "$types/strict";
import { eq } from "drizzle-orm";
import { systemsToParts } from "./schema";

export const systemsToPartsQueries = {
	create: async (values: Types.SystemToPartsNew) =>
		await db
			.insert(systemsToParts)
			.values(values)
			.returning()
			.then((v) => v[0]),
	createBatch: async (values: Types.SystemToPartsNew[]) => {
		await db.insert(systemsToParts).values(values).returning();
	},
};
