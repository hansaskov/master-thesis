import { authMiddleware } from "$auth/middleware";
import { Queries } from "$collections/queries";
import Elysia, { error, t } from "elysia";

export const usersApi = new Elysia({ prefix: "users" })
	.use(authMiddleware)
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
	);
