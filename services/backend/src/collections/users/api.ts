import { authMiddleware } from "$auth/middleware";
import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import Elysia, { error, t } from "elysia";

export const usersApi = new Elysia({ prefix: "users" })
	.use(authMiddleware)
	.get(
		"/",
		async ({ user }) => {
			return await Queries.users.selectAll();
		},
		{
			isSuperAdmin: true,
		},
	)
	.get(
		"/onOrganization",
		async ({ relation }) => {
			return await Queries.users.selectAllOnOrganization({
				id: relation.organization_id,
			});
		},
		{
			isOrganization: true,
		},
	)
	.delete(
		"/",
		async ({ user, body, relation }) => {
			if (user.is_superadmin === false) {
				const userToDeleteRelation = await Queries.usersToOrganizations.select({
					organization_id: relation.organization_id,
					user_id: body.id,
				});

				if (userToDeleteRelation === undefined) {
					return error("Not Found", "User does not exist on this organization");
				}

				if (userToDeleteRelation.role !== "Admin") {
					return error("Forbidden", "You are not allowed to delete this user");
				}
			}

			const result = await Queries.users.delete({ id: body.id });

			if (result === undefined) {
				return error("Not Found", "Deletion failed. User not found");
			}

			return result;
		},
		{
			body: t.Object({
				id: t.String(),
			}),
			isOrganizationAdmin: true,
		},
	)
	.get(
		"/superAdmins",
		async ({ user }) => {
			const result = await Queries.users.getAllSuperAdmins();
			return result;
		},
		{
			isSuperAdmin: true,
		},
	)
	.patch(
		"/",
		async ({ user, body }) => {
			const result = await Queries.users.updateSuperadminField(
				body.id,
				body.newValue,
			);
		},
		{
			body: t.Object({
				id: t.String(),
				newValue: t.Boolean(),
			}),
			isSuperAdmin: true,
		},
	);
