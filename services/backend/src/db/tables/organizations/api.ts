import Elysia, { error, t } from "elysia";
import { AuthService } from "../../../auth/middleware";
import { Queries, Schema } from "../../model";

export const organizationsApi = new Elysia({ prefix: "organizations" })
	.use(AuthService)
	.get("/", async ({ user }) => {
		if (user.is_superadmin) {
			return await Queries.organizations.selectAll();
		}

		return await Queries.organizations.selectOrganizationsOnUser({
			id: user.id,
		});
	})
	.patch(
		"/",
		async ({ user, body }) => {
			const relation = await Queries.usersToOrganizations.select({
				userId: user.id,
				organizationId: body.id,
			});

			if (!user.is_superadmin) {
				if (!relation) {
					return error(
						"Unauthorized",
						"You do not have access to this organization",
					);
				}

				if (relation.role !== "Admin") {
					return error(
						"Unauthorized",
						"Only admins are allowed to edit this organization",
					);
				}
			}

			const result = await Queries.organizations.update(body);

			if (result === undefined) {
				return error("Not Found", "Organization not found");
			}

			return result;
		},
		{
			body: t.Object({
				name: t.Optional(Schema.insert.organizations.name),
				id: Schema.select.organizations.id,
			}),
		},
	)
	.post(
		"/",
		async ({ user, body }) => {
			if (!user.is_superadmin) {
				return error(
					"Unauthorized",
					"Only superadmins are allowed to create organizations",
				);
			}

			return await Queries.organizations.create({ name: body.name });
		},
		{
			body: t.Object({
				name: Schema.insert.organizations.name,
			}),
		},
	)
	.delete(
		"/",
		async ({ user, body }) => {
			if (!user.is_superadmin) {
				return error(
					"Unauthorized",
					"Only superadmins are allowed to delete organizations",
				);
			}

			const result = await Queries.organizations.delete({ id: body.id });

			if (result === undefined) {
				return error(
					"Not Found",
					"Cannot delete, because organization was not found",
				);
			}

			return result;
		},
		{
			body: t.Object({
				id: Schema.select.organizations.id,
			}),
		},
	);
