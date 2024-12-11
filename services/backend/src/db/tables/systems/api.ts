import Elysia, { error, t } from "elysia";
import { AuthService } from "../../../auth/middleware";
import { Queries, Schema } from "../../model";

export const systemsApi = new Elysia({ prefix: "systems" })
	.use(AuthService)
	.get("/", async ({ user }) => {
		return await Queries.systems.selectAll();
	})
	.post(
		"/",
		async ({ user, body }) => {
			if (user.is_superadmin) {
				return await Queries.systems.create({
					name: body.name,
					organization_id: body.organization_id,
					system_model: body.system_model,
				});
			}

			const relation = await Queries.usersToOrganizations.select({
				userId: user.id,
				organizationId: body.organization_id,
			});

			if (!relation) {
				return error(
					"Unauthorized",
					"You do not have access to this organization",
				);
			}

			if (relation.role !== "Admin") {
				return error(
					"Unauthorized",
					"Only admins are allowed to create production systems",
				);
			}

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
		},
	);
