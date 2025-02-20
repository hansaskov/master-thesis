import { AuthService, authMiddleware } from "$auth/middleware";
import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import Elysia, { error, t } from "elysia";

export const systemsApi = new Elysia({ prefix: "systems" })
	.use(authMiddleware)
	.get("/", async () => {
		return await Queries.systems.selectAll();
	})
	.get(
		"/get_on_org_id",
		async ({ user, body, relation }) => {
			return await Queries.systems.selectAllOnOrgId({
				id: relation.organization_id,
			});
		},
		{
			isOrganization: true,
		},
	)
	.post(
		"/",
		async ({ user, body }) => {
			return await Queries.systems.create({
				name: body.name,
				organization_id: body.organization_id,
				system_model: body.system_model,
			});
		},
		{
			body: t.Object({
				name: Schema.insert.systems.name,
				organization_id: Schema.insert.systems.organization_id,
				system_model: Schema.insert.systems.system_model,
			}),
			isSuperAdmin: true,
		},
	)
	.delete(
		"/",
		async ({ user, body }) => {
			const result = await Queries.systems.delete({ id: body.id });

			if (result === undefined) {
				return error(
					"Not Found",
					"Cannot delete, because production system was not found",
				);
			}

			return result;
		},
		{
			body: t.Object({
				id: Schema.select.systems.id,
			}),
			isSuperAdmin: true,
		},
	);
