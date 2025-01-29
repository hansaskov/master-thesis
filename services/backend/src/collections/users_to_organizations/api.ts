import { AuthService } from "$auth/middleware";
import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import Elysia, { error, t } from "elysia";

export const usersToOrganizationsApi = new Elysia({
	prefix: "/usersToOrganization",
})
	.use(AuthService)
	.post(
		"/",
		async ({ user, body }) => {
			if (!user.is_superadmin) {
				const organizationAccess = await Queries.usersToOrganizations.select({
					user_id: user.id,
					organization_id: body.organization_id,
				});

				if (!organizationAccess) {
					return error(
						"Not Found",
						"You do not have access to this organization or it does not exist",
					);
				}

				if (organizationAccess.role !== "Admin") {
					return error(
						"Unauthorized",
						"Only organization admins can do this action",
					);
				}

				return error("Internal Server Error", "Ups. Something went wrong");
			}

			return await Queries.usersToOrganizations.create(body);
		},
		{
			body: t.Object({
				organization_id: Schema.insert.usersToOrganizations.organization_id,
				user_id: Schema.insert.usersToOrganizations.user_id,
				role: Schema.insert.usersToOrganizations.role,
			}),
		},
	)
	.delete(
		"/:organizationId/:userId",
		async ({ user, params, query, body }) => {
			// Check if membership exists
			const membership = await Queries.usersToOrganizations.select(body);

			if (!membership) {
				return error("Not Found", "Membership not found");
			}

			// Authorization check
			if (!user.is_superadmin) {
				const requesterAccess = await Queries.usersToOrganizations.select({
					user_id: user.id,
					organization_id: body.organization_id,
				});

				if (!requesterAccess || requesterAccess.role !== "Admin") {
					return error(
						"Unauthorized",
						"Only organization admins can remove members",
					);
				}

				// Prevent admins from removing themselves
				if (body.user_id === user.id) {
					return error(
						"Forbidden",
						"Admins cannot remove themselves from the organization",
					);
				}
			}

			return await Queries.usersToOrganizations.delete(body);
		},
		{
			body: t.Object({
				organization_id: Schema.insert.usersToOrganizations.organization_id,
				user_id: Schema.insert.usersToOrganizations.user_id,
			}),
		},
	);
