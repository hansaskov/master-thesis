import { systems } from "$collections/systems/schema";
import { systemsToParts } from "$collections/systems_to_parts/schema";
import { db } from "$db/postgres";
import type { Types } from "$types/collection";
import type { StrictPick } from "$types/strict";
import { and, eq } from "drizzle-orm";
import { partsToSystemModels } from "../parts_to_system_models/schema";
import { parts } from "./schema";

export const partQueries = {
	delete: async ({ id }: StrictPick<Types.Part, "id">) =>
		await db
			.delete(parts)
			.where(eq(parts.id, id))
			.returning()
			.then((v) => v.at(0)),
	create: async (values: Types.PartNew) =>
		await db
			.insert(parts)
			.values(values)
			.returning()
			.then((v) => v[0]),
	update: async (values: Types.PartUpdate) =>
		await db
			.update(parts)
			.set(values)
			.where(eq(parts.id, values.id))
			.returning()
			.then((v) => v.at(0)),
	selectAll: async () => await db.select().from(parts),
	assignToSystemModel: async ({
		part_id,
		system_model_id,
	}: Types.PartToSystemModelNew) =>
		await db
			.insert(partsToSystemModels)
			.values({ part_id, system_model_id })
			.returning()
			.then((v) => v[0]),
	getBySystem: async (id: string) =>
		await db
			.select()
			.from(parts)
			.innerJoin(systemsToParts, eq(parts.id, systemsToParts.parts_id))
			.where(eq(systemsToParts.system_id, id)),
};
