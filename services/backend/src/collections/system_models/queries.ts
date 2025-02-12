import { db } from "$db/postgres";
import type { Types } from "$types/collection";
import type { StrictPick } from "$types/strict";
import { eq } from "drizzle-orm";
import { systemModels } from "./schema";

export const systemModelQueries = {
	create: async (values: Types.SystemModelNew) =>
		await db
			.insert(systemModels)
			.values(values)
			.returning()
			.then((v) => v[0]),
	selectAll: async () => await db.select().from(systemModels),
	delete: async ({ id }: StrictPick<Types.System, "id">) =>
		await db
			.delete(systemModels)
			.where(eq(systemModels.id, id))
			.returning()
			.then((v) => v.at(0)),
};
