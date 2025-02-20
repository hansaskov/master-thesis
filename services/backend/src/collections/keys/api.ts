import { authMiddleware } from "$auth/middleware";
import { Queries } from "$collections/queries";
import Elysia, { error, t } from "elysia";
import { insertKeysSchema } from "./schema";

export const keysApi = new Elysia({ prefix: "keys", name: "API-KEYS" })
	.use(authMiddleware)
	.get(
		"/",
		async ({ query }) => {
			return await Queries.keys.selectAllOnSystem({ id: query.system_id });
		},
		{
			query: t.Object({
				system_id: t.String(),
			}),
			isOrganizationAdmin: true,
		},
	)
	.post(
		"/",
		async ({ body }) => {
			return await Queries.keys.create(body);
		},
		{
			body: insertKeysSchema,
			isOrganizationAdmin: true,
		},
	)
	.delete(
		"/",
		async ({ body }) => {
			return await Queries.keys.delete(body);
		},
		{
			body: t.Object({
				id: t.String({ minLength: 1 }),
			}),
			isOrganizationAdmin: true,
		},
	);
