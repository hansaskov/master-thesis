import { Schema } from "$collections/schema";
import type { Session, User } from "$collections/types";
import Elysia, { error } from "elysia";
import { setSessionTokenCookie, validateSessionToken } from "./lucia";

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
				if (!sessionId.value) {
					return error("Bad Request", "You must pass a valid session id");
				}

				const { user, session } = await validateSessionToken(sessionId.value);

				if (!session) {
					return error("Unauthorized", "Authentication is required");
				}

				return { user, session };
			},
		},
		isSuperAdmin: {
			async resolve({ cookie: { sessionId } }) {
				if (!sessionId.value) {
					return error("Bad Request", "You must pass a valid session id");
				}

				const { user, session } = await validateSessionToken(sessionId.value);

				if (!session) {
					return error("Unauthorized", "Authentication is required");
				}

				if (user.is_superadmin === false) {
					return error("Unauthorized", "Superadmin priviliges are required");
				}

				return { user, session };
			},
		},
	})
	.as("plugin");