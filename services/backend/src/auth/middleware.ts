import { Schema } from "$db/collections";
import Elysia, { error } from "elysia";
import type { Session, User } from "../db/collections";
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
