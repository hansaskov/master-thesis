import { db } from "$db/postgres";
import type { Types } from "$types/collection";
import type { StrictPick } from "$types/strict";
import { and, eq, or } from "drizzle-orm";
import { parts } from "../parts/schema";
import { partsToSystemModels } from "./schema";

type DeletePartToSystemModel = {
	part_id?: Types.PartToSystemModel["part_id"];
	system_model_id?: Types.PartToSystemModel["system_model_id"];
};

type BulkOperation = {
	additions: Types.PartToSystemModelNew[];
	deletions: Array<{
		part_id: Types.PartToSystemModel["part_id"];
		system_model_id: Types.PartToSystemModel["system_model_id"];
	}>;
};

type BatchUpdateResult = {
	additions: Types.PartToSystemModel[];
	deletions: Types.PartToSystemModel[];
};

export const partsToSystemModelsQueries = {
	create: async (values: Types.PartToSystemModelNew) =>
		await db
			.insert(partsToSystemModels)
			.values(values)
			.returning()
			.then((v) => v[0]),
	delete: async (values: DeletePartToSystemModel) => {
		if (!values.part_id && !values.system_model_id) {
			throw new Error("Either part_id or system_model_id must be provided");
		}

		const query = db
			.delete(partsToSystemModels)
			.where(
				or(
					values.part_id
						? eq(partsToSystemModels.part_id, values.part_id)
						: undefined,
					values.system_model_id
						? eq(partsToSystemModels.system_model_id, values.system_model_id)
						: undefined,
				),
			);

		return await query.returning().then((v) => v.at(0));
	},
	bulkCreate: async (values: Types.PartToSystemModelNew[]) => {
		if (values.length === 0) return [];
		return await db
			.insert(partsToSystemModels)
			.values(values)
			.onConflictDoNothing() // Ignore duplicates
			.returning();
	},
	bulkDelete: async (
		relations: Array<{ part_id: string; system_model_id: string }>,
	) => {
		if (relations.length === 0) return [];
		return await db
			.delete(partsToSystemModels)
			.where(
				or(
					...relations.map((relation) =>
						and(
							eq(partsToSystemModels.part_id, relation.part_id),
							eq(partsToSystemModels.system_model_id, relation.system_model_id),
						),
					),
				),
			)
			.returning();
	},
	batchUpdate: async (
		operations: BulkOperation,
	): Promise<BatchUpdateResult> => {
		return await db.transaction(async (tx) => {
			const results: BatchUpdateResult = {
				additions: [],
				deletions: [],
			};

			if (operations.additions.length > 0) {
				results.additions = await tx
					.insert(partsToSystemModels)
					.values(operations.additions)
					.onConflictDoNothing()
					.returning();
			}

			if (operations.deletions.length > 0) {
				results.deletions = await tx
					.delete(partsToSystemModels)
					.where(
						or(
							...operations.deletions.map((relation) =>
								and(
									eq(partsToSystemModels.part_id, relation.part_id),
									eq(
										partsToSystemModels.system_model_id,
										relation.system_model_id,
									),
								),
							),
						),
					)
					.returning();
			}

			return results;
		});
	},

	// old way of doing it as backup
	// await db
	//     .delete(partsToSystemModels)
	//     .where(eq(partsToSystemModels.part_id, values.part_id))
	//     .returning()
	//     .then((v) => v.at(0)),
};
