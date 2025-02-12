import { AuthService } from "$auth/middleware";
import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import Elysia, { error, t } from "elysia";

export const systemModelsApi = new Elysia({ prefix: "system_models" })
	.use(AuthService)
	.get("/", async ({ user }) => {
		return await Queries.systemModels.selectAll();
	});
