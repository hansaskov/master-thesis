import { authMiddleware } from "$auth/middleware";
import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import { environment } from "$config/environment";
import Elysia, { error, redirect, t } from "elysia";
import { emailClient } from "../../email/interface";

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
			if (user.email === body.email) {
				return error("Bad Request", "You cannot invite yourself");
			}

			const invite = await Queries.invites.selectOnEmailAndOrganization({
				email: body.email,
				organization_id: relation.organization_id,
			});

			if (invite && invite.expires_at < new Date()) {
				return error(
					"Conflict",
					`${invite.email} has already been invited to this organization`,
				);
			}

			const organization = await Queries.organizations.selectUnique(
				relation.organization_id,
			);

			if (!organization) {
				return error("Not Found");
			}

			const newInvite = await Queries.invites.create({
				inviter_id: user.id,
				organization_id: relation.organization_id,
				...body,
			});

			const invitationLink = `${environment.INTERFACE_FQDN}/api/invites/accept/${newInvite.id}`;
			const emailBody = `You have been invited to join ${organization.name} by ${user.name}. To accept this invitation, login with your account, then come back and click the link below \n ${invitationLink}`;

			const isSuccess = await emailClient.send({
				from: "hans@hjemmet.net",
				to: body.email,
				subject: "Invitation to join TriVisionAs App",
				html: emailBody,
			});

			if (!isSuccess) {
				await Queries.invites.delete(newInvite);
				return error("Bad Request", "Email failed to send");
			}

			return invite;
		},
		{
			body: t.Object({
				email: Schema.insert.invites.email,
				role: Schema.insert.invites.role,
			}),
			isOrganizationAdmin: true,
		},
	)
	.patch(
		"/",
		async ({ user, body, relation }) => {
			return await Queries.invites.update({
				organization_id: relation.organization_id,
				...body,
			});
		},
		{
			body: t.Object({
				email: Schema.insert.invites.email,
				role: Schema.insert.invites.role,
			}),
			isOrganizationAdmin: true,
		},
	)
	.delete(
		"/",
		async ({ user, body, relation }) => {
			const result = await Queries.invites.delete({
				organization_id: relation.organization_id,
				...body,
			});

			if (result === undefined) {
				return error("Not Found", "Deletion failed. User not found");
			}

			return result;
		},
		{
			body: t.Object({
				email: t.String(),
			}),
			isOrganizationAdmin: true,
		},
	)
	.get(
		"/accept/:id",
		async ({ params: { id }, user }) => {
			const invite = await Queries.invites.selectOnPrimaryId({ id });

			if (!invite) {
				error("Not Found");
				return redirect("/");
			}

			if (invite.is_accepted) {
				error(
					"Already Reported",
					"This invite has alreadt been accepted and cannot be used more than once",
				);
				return redirect("/");
			}

			const existingRelation = await Queries.usersToOrganizations.select({
				organization_id: invite.organization_id,
				user_id: user.id,
			});

			if (existingRelation) {
				error("Forbidden", "You are already part of this organization");
				return redirect("/");
			}

			if (user.email && user.email !== invite.email) {
				error(
					"Forbidden",
					"This invite is not meant for you. The email of the user does not match the invite",
				);
				return redirect("/");
			}

			const relation = Queries.usersToOrganizations.create({
				organization_id: invite.organization_id,
				user_id: user.id,
				role: invite.role,
			});

			await Queries.invites.delete(invite);

			return redirect("/organization");
		},
		{
			params: t.Object({
				id: t.String(),
			}),
			isAuth: true,
		},
	);
