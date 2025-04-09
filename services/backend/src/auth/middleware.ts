import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import type {
	Session,
	User,
	UserToOrganizationNew,
	UserToOrganizationUpdate,
} from "$collections/types";
import Elysia, { error } from "elysia";
import {
	Authenticate,
	setSessionTokenCookie,
	validateSessionToken,
} from "./lucia";
import { env } from "bun";

export const AuthService = new Elysia({ name: "Service.Auth" })
	.guard({
		cookie: Schema.cookie.session,
	})
	.resolve(async ({ cookie: { sessionId } }) => {
		const { user, session } = await validateSessionToken(sessionId.value);
		return { user, session };
	})
	.onBeforeHandle(({ user, session, cookie: { sessionId } }) => {
		if (!user || !session) {
			sessionId.remove();
			return error("Unauthorized", "The provided sessionId is invalid");
		}
	})
	.resolve(({ user, session, cookie: { sessionId } }) => {
		// We can safely cast the types here because
		// sessionId is validated in the previous onBeforeHandle hook
		user = user as User;
		session = session as Session;

		setSessionTokenCookie(sessionId, sessionId.value, session.expires_at);

		return { user, session };
	})
	.as("plugin");

export const SuperAdminService = new Elysia({ name: "Service.SuperAdmin" })
	.use(AuthService)
	.onBeforeHandle(({ user }) => {
		if (!user.is_superadmin) {
			return error(
				"Unauthorized",
				"The provided user must be a superadmin to ",
			);
		}
	})

	.as("plugin");

export const authMiddleware = new Elysia()
	.macro({
		isAuth: {
			async resolve({ cookie: { sessionId } }) {
				if (env.IS_TEST === "true") {
					console.log("This is a test!")
					return
				}

				if (!sessionId.value) {
					return error("Bad Request", "You must pass a valid session id");
				}

				const { user, session } = await Authenticate(sessionId);

				if (!session) {
					return error("Unauthorized", "Your session has expired as auth");
				}

				return { user, session };
			},
		},
		isSuperAdmin: {
			async resolve({ cookie: { sessionId } }) {
				if (env.IS_TEST === "true") {
					console.log("This is a test!")
					return
				}

				if (!sessionId.value) {
					return error("Bad Request", "You must pass a valid session id");
				}

				const { user, session } = await Authenticate(sessionId);

				if (!session) {
					return error("Unauthorized", "Your session has expired superadmin");
				}

				if (user.is_superadmin === false) {
					return error("Unauthorized", "Superadmin priviliges are required");
				}

				return { user, session };
			},
		},
		isOrganizationAdmin: {
			async resolve({
				cookie: {
					sessionId,
					organizationId: { value: organizationId },
				},
			}) {
				if (env.IS_TEST === "true") {
					console.log("This is a test!")
					return
				}

				if (!sessionId.value) {
					return error("Bad Request", "You must pass a valid session id");
				}

				if (organizationId === undefined) {
					return error(
						"Bad Request",
						"organizationId is required in your cookies",
					);
				}

				const { user, session } = await Authenticate(sessionId);

				if (!session) {
					return error("Unauthorized", "Your session has expired as admin");
				}

				let relation: UserToOrganizationUpdate = {
					organization_id: organizationId,
					user_id: user.id,
				};

				if (user.is_superadmin === false) {
					const r = await Queries.usersToOrganizations.select({
						user_id: user.id,
						organization_id: organizationId,
					});

					if (!r) {
						return error(
							"Bad Request",
							"User has no relation that organization",
						);
					}

					if (r.role !== "Admin") {
						return error(
							"Unauthorized",
							"Only organization admins are allowed to edit this organization",
						);
					}

					relation = r;
				}

				return { user, session, relation };
			},
		},
		isOrganization: {
			async resolve({ cookie: { sessionId, organizationId } }) {
				if (env.IS_TEST === "true") {
					console.log("This is a test!")
					return
				}

				if (!sessionId.value) {
					return error("Bad Request", "You must pass a valid session id");
				}

				if (organizationId.value === undefined) {
					return error(
						"Bad Request",
						"organizationId is required in your cookies",
					);
				}

				const { user, session } = await Authenticate(sessionId);

				if (!session) {
					return error("Unauthorized", "Your session has expired as user");
				}

				let relation: UserToOrganizationUpdate = {
					organization_id: organizationId.value,
					user_id: user.id,
				};

				if (user.is_superadmin === false) {
					const r = await Queries.usersToOrganizations.select({
						user_id: user.id,
						organization_id: organizationId.value,
					});

					if (!r) {
						return error(
							"Bad Request",
							"User has no relation that organization",
						);
					}

					relation = r;
				}

				return { user, session, relation };
			},
		},
	})
	.as("plugin");
