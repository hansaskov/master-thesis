import { authMiddleware } from "$auth/middleware";
import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import Elysia, { error, t } from "elysia";

const RelationSchema = t.Object({
	parts_id: Schema.insert.systemsToParts.parts_id,
	system_id: Schema.insert.systemsToParts.system_id,
});

const BatchUpdateSchema = t.Array(RelationSchema);

export const systemsToPartsApi = new Elysia({
	prefix: "systems_to_parts",
})
	.use(authMiddleware)
	.post(
		"/",
		async ({ user, body }) => {
			const result = await Queries.systemsToParts.create(body);
			return result;
		},
		{
			body: t.Object({
				parts_id: Schema.insert.systemsToParts.parts_id,
				system_id: Schema.insert.systemsToParts.system_id,
			}),
			isOrganizationAdmin: true,
		},
	)
	.post(
		"/batch",
		async ({ user, body }) => {
			const result = await Queries.systemsToParts.createBatch(body);
			return result;
		},
		{
			body: BatchUpdateSchema,
			isOrganizationAdmin: true,
		},
	);
