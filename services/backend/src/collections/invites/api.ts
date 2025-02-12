import { authMiddleware } from "$auth/middleware";
import { Queries } from "$collections/queries";
import Elysia, { error, t } from "elysia";

export const invitesApi = new Elysia({ prefix: "invites" })
	.use(authMiddleware)
	.get(
		"/onOrganization",
		async ({ relation }) => {
			return await Queries.invites.selectInvitesOnOrganization({
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
			const result = await Queries.invites.delete({ id: body.id });

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
