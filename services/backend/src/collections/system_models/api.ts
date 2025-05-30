import { authMiddleware } from "$auth/middleware";
import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import Elysia, { error, t } from "elysia";

export const systemModelsApi = new Elysia({ prefix: "system_models" })
	.use(authMiddleware)
	.get(
		"/",
		async ({ user }) => {
			const result = await Queries.systemModels.selectAll();
			return result;
		},
		{
			isSuperAdmin: true,
		},
	);
