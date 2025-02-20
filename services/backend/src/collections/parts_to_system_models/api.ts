import { authMiddleware } from "$auth/middleware";
import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import Elysia, { error, t } from "elysia";

const RelationSchema = t.Object({
	part_id: Schema.insert.partsToSystemModels.part_id,
	system_model_id: Schema.insert.partsToSystemModels.system_model_id,
});

const BatchUpdateSchema = t.Object({
	additions: t.Array(RelationSchema),
	deletions: t.Array(RelationSchema),
});

export const partsToSystemModelApi = new Elysia({
	prefix: "parts_to_system_models",
})
	.use(authMiddleware)
	.post(
		"/",
		async ({ user, body }) => {
			const result = await Queries.partsToSystemModels.create(body);
			return result;
		},
		{
			body: t.Object({
				part_id: Schema.insert.partsToSystemModels.part_id,
				system_model_id: Schema.insert.partsToSystemModels.system_model_id,
			}),
			isSuperAdmin: true,
		},
	)
	.delete(
		"/",
		async ({ user, body }) => {
			const result = await Queries.partsToSystemModels.delete(body);
			return result;
		},
		{
			body: t.Union([
				t.Object({
					part_id: Schema.insert.partsToSystemModels.part_id,
					system_model_id: t.Optional(
						Schema.insert.partsToSystemModels.system_model_id,
					),
				}),
				t.Object({
					part_id: t.Optional(Schema.insert.partsToSystemModels.part_id),
					system_model_id: Schema.insert.partsToSystemModels.system_model_id,
				}),
			]),
			isSuperAdmin: true,
		},
	)
	.post(
		"/batch",
		async ({ user, body }) => {
			return await Queries.partsToSystemModels.batchUpdate({
				additions: body.additions,
				deletions: body.deletions,
			});
		},
		{
			body: BatchUpdateSchema,
			isSuperAdmin: true,
		},
	);
