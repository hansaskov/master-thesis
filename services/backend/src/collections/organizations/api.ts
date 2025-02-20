import { setSessionTokenCookie } from "$auth/lucia";
import { authMiddleware } from "$auth/middleware";
import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import Elysia, { error, t } from "elysia";

export const organizationsApi = new Elysia({ prefix: "organizations" })
	.use(authMiddleware)
	.get(
		"/",
		async ({ user }) => {
			if (user.is_superadmin === true) {
				return await Queries.organizations.selectAll();
			}

			return await Queries.organizations.selectOrganizationsOnUser({
				id: user.id,
			});
		},
		{
			isAuth: true,
		},
	)
	.patch(
		"/",
		async ({ body, relation }) => {
			const result = await Queries.organizations.update({
				id: relation.organization_id,
				name: body.name,
			});

			if (result === undefined) {
				return error("Not Found", "Organization not found");
			}

			return result;
		},
		{
			isOrganizationAdmin: true,
			body: t.Object({
				name: t.Optional(Schema.insert.organizations.name),
			}),
		},
	)
	.post(
		"/",
		async ({ body }) => {
			return await Queries.organizations.create(body);
		},
		{
			body: t.Object({
				name: Schema.insert.organizations.name,
			}),
			isSuperAdmin: true,
		},
	)
	.delete(
		"/",
		async ({ body }) => {
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
			isSuperAdmin: true,
		},
	)
	.post(
		"/cookie",
		({ cookie, body: { organizationId }, session }) => {
			setSessionTokenCookie(
				cookie.organizationId,
				organizationId,
				session.expires_at,
			);
		},
		{
			body: t.Object({
				organizationId: t.String(),
			}),
			cookie: t.Optional(Schema.cookie.session),
			isAuth: true,
		},
	);
