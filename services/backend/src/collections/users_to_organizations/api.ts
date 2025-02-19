import { AuthService, authMiddleware } from "$auth/middleware";
import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import Elysia, { error, t } from "elysia";
import { insertUserToOrganizationSchema } from "./schema";

export const usersToOrganizationsApi = new Elysia({
	prefix: "/usersToOrganization",
})
	.use(authMiddleware)
	.post(
		"/",
		async ({ body, user }) => {
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
			isOrganizationAdmin: true,
		},
	)
	.patch(
		"/",
		async ({ user, body, relation }) => {
			if (!user.is_superadmin && user.id === body.user_id) {
				return error(
					"Unauthorized",
					"You cannot demote yourself. Another admin or a superadmin must do this",
				);
			}

			return Queries.usersToOrganizations.update({
				organization_id: relation.organization_id,
				...body,
			});
		},
		{
			body: t.Object({
				user_id: Schema.insert.usersToOrganizations.user_id,
				role: Schema.insert.usersToOrganizations.role,
			}),
			isOrganizationAdmin: true,
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
				if (user.id === body.user_id) {
					return error(
						"Unauthorized",
						"You cannot remove yourself. An Admin must do this action",
					);
				}

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
			isAuth: true,
		},
	);
