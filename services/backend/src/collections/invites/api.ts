import { authMiddleware } from "$auth/middleware";
import { Queries } from "$collections/queries";
import Elysia, { error, t } from "elysia";
import { insertInvitesSchema } from "./schema";
import { Schema } from "$collections/schema";

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
	.post(
		"/",
		async ({ user, body, relation }) => {

			// TODO: Send email to user with link to sign up
			return await Queries.invites.create({
				inviter_id: user.id,
				organization_id: relation.organization_id,
				...body
			});
		},
		{
			body: t.Object({
				email: Schema.insert.invites.email,
				role: Schema.insert.invites.role

			}),
			isOrganizationAdmin: true,
		},
	)
	.patch(
		"/",
		async ({ user, body, relation }) => {
			return await Queries.invites.update({
				organization_id: relation.organization_id,
				...body
			});
		},
		{
			body: t.Object({
				email: Schema.insert.invites.email,
				role: Schema.insert.invites.role

			}),
			isOrganizationAdmin: true,
		},
	)
	.delete(
		"/",
		async ({ user, body, relation }) => {
			const result = await Queries.invites.delete(body);

			if (result === undefined) {
				return error("Not Found", "Deletion failed. User not found");
			}

			return result;
		},
		{
			body: t.Object({
				email: t.String(),
				organization_id: t.String(),
			}),
			isOrganizationAdmin: true,
		},
	);
