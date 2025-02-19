import { authMiddleware } from "$auth/middleware";
import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import Elysia, { t } from "elysia";

export const statusApi = new Elysia({ prefix: "status" })
	.use(authMiddleware)
	.get(
		"/",
		({ user }) =>
			`You are authenticated with ${user.provider_name} as user: ${user.provider_id}`,
		{
			isAuth: true,
		},
	)
	.get(
		"/refresh",
		async ({ user, cookie: { organizationId } }) => {
			if (organizationId.value) {
				const relation = await Queries.usersToOrganizations.select({
					organization_id: organizationId.value,
					user_id: user.id,
				});

				return { relation, user };
			}

			return { user };
		},
		{
			cookie: t.Optional(Schema.cookie.organization),
			isAuth: true,
		},
	);
