import { db } from "$db/postgres";
import type { Types } from "$types/collection";
import type { StrictPick } from "$types/strict";
import { and, eq, inArray } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { parts } from "../parts/schema";
import { partsToSystemModels } from "../parts_to_system_models/schema";
import { systemModels } from "./schema";

export const systemModelQueries = {
	create: async (values: Types.SystemModelNew) =>
		await db
			.insert(systemModels)
			.values(values)
			.returning()
			.then((v) => v[0]),
	selectAll: async () => {
		const results = await db
			.select({
				id: systemModels.id,
				name: systemModels.name,
				parts: sql<string>`COALESCE(json_agg(
					CASE WHEN ${parts.id} IS NOT NULL THEN
						json_build_object(
							'id', ${parts.id},
							'name', ${parts.name},
							'image', ${parts.image}
						)
					ELSE NULL
					END
				) FILTER (WHERE ${parts.id} IS NOT NULL), '[]'::json)`,
			})
			.from(systemModels)
			.leftJoin(
				partsToSystemModels,
				eq(partsToSystemModels.system_model_id, systemModels.id),
			)
			.leftJoin(parts, eq(parts.id, partsToSystemModels.part_id))
			.groupBy(systemModels.id, systemModels.name);

		console.log("Raw query results:", results);

		try {
			// Map and parse with error handling
			return results.map((result) => {
				console.log("Processing result:", result);
				console.log("Parts before parsing:", result.parts);
				return {
					id: result.id,
					name: result.name,
					parts:
						typeof result.parts === "string"
							? JSON.parse(result.parts)
							: result.parts || [],
				};
			});
		} catch (error) {
			console.error("Error processing results:", error);
			console.error("Failed result:", results);
			// Return raw results as fallback
			return results.map((result) => ({
				id: result.id,
				name: result.name,
				parts: [],
			}));
		}
	},
	selectOnId: async ({ id }: StrictPick<Types.SystemModel, "id">) =>
		await db.select().from(systemModels).where(eq(systemModels.id, id)),
	delete: async ({ id }: StrictPick<Types.SystemModel, "id">) =>
		await db
			.delete(systemModels)
			.where(eq(systemModels.id, id))
			.returning()
			.then((v) => v.at(0)),
};
