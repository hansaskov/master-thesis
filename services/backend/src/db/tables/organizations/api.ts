import Elysia, { error, t } from "elysia";
import { AuthService } from "../../../auth/middleware";
import { Queries, Schema } from "../../model";

export const organizationsApi = new Elysia({ prefix: "organizations" })
	.use(AuthService)
	.get("/", ({ user }) =>
		Queries.organizations.selectOrganizationsOnUser({ id: user.id }),
	)
	.post(
		"/",
		async ({ user, query }) => {
			const relation = await Queries.usersToOrganizations.select({
				user_id: user.id,
				organization_id: query.id,
			});

			if (!relation) {
				return error(
					"Unauthorized",
					"This organization does not exist, or you do not have permission to update it",
				);
			}

			if (relation.role !== "Admin") {
				return error(
					"Unauthorized",
					"Only admins are allowed to edit this organization",
				);
			}

			const result = await Queries.organizations.update(query);

			if (result === undefined) {
				return error("Not Found", "Organization not found");
			}

			return result;
		},
		{
			query: t.Object({
				id: Schema.select.organizations.id,
			}),
		},
	);
