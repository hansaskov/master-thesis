import { AuthService, authMiddleware } from "$auth/middleware";
import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import Elysia, { error, t } from "elysia";

export const systemsApi = new Elysia({ prefix: "systems" })
	.use(authMiddleware)
	.get("/", async () => {
		return await Queries.systems.selectAllWithHealth();
	})
	.get(
		"/get_on_org_id",
		async ({ user, body, relation }) => {
			return await Queries.systems.selectAllWithHealth({
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
	.patch(
		"/",
		async ({ body, relation }) => {
			return await Queries.systems.update({
				id: body.id,
				name: body.name,
				organization_id: relation.organization_id,
				system_model: body.system_model,
			});
		},
		{
			body: t.Object({
				id: t.String(),
				name: t.Optional(t.String()),
				system_model: t.Optional(Schema.insert.systems.system_model),
			}),
			isOrganizationAdmin: true,
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
