import { db } from "$db/postgres";
import type { Types } from "$types/collection";
import type { StrictPick } from "$types/strict";
import { eq } from "drizzle-orm";
import { parts } from "../parts/schema"
import { create } from "domain";
import { partsToSystemModels } from "./schema";

export const partsToSystemModelsQueries = {
    create: async (values: Types.PartToSystemModelNew) =>
        await db
            .insert(partsToSystemModels)
            .values(values)
            .returning()
			.then((v) => v[0]),
    delete: async (values: Types.PartToSystemModel) =>
        await db
            .delete(partsToSystemModels)
            .where(eq(partsToSystemModels.part_id, values.part_id))
            .returning()
            .then((v) => v.at(0)),
};