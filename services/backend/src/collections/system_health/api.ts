import { authMiddleware } from "$auth/middleware";
import { Queries } from "$collections/queries";
import Elysia, { t } from "elysia";

export const systemHealthApi = new Elysia({ prefix: "system/health" })
	.use(authMiddleware)
	.guard({
		isOrganization: true,
	})
	.get(
		"/",
		async ({ query }) => {
			return await Queries.systemHealth.selectLatest(query);
		},
		{
			query: t.Object({
				system_id: t.String(),
			}),
		},
	);
