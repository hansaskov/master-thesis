import { db } from "$db/postgres";
import type { Types } from "$types/collection";
import type { StrictPick } from "$types/strict";
import { eq } from "drizzle-orm";
import { partsToSystemModels } from "../parts_to_system_models/schema";
import { parts } from "../parts/schema"
import { systemModels } from "./schema";

export const systemModelQueries = {
	create: async (values: Types.SystemModelNew) =>
		await db
			.insert(systemModels)
			.values(values)
			.returning()
			.then((v) => v[0]),
	selectAll: async () => 
		await db
			.select({
				systemModels,
				parts
			})
			.from(systemModels)
			.leftJoin(
				partsToSystemModels,
				eq(partsToSystemModels.system_model_id, systemModels.id)
			)
			.leftJoin(
				parts,
				eq(parts.id, partsToSystemModels.part_id)
			),
	selectOnId: async({ id }: StrictPick<Types.SystemModel, "id">) =>
		await db
			.select()
			.from(systemModels)
			.where(eq(systemModels.id, id)),
	delete: async ({ id }: StrictPick<Types.SystemModel, "id">) =>
		await db
			.delete(systemModels)
			.where(eq(systemModels.id, id))
			.returning()
			.then((v) => v.at(0)),
};
