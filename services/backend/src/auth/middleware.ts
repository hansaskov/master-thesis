import Elysia from "elysia";
import { Schema } from "../db/model";
import type { Session, User } from "../db/tables";
import { setSessionTokenCookie, validateSessionToken } from "./lucia";

export const AuthService = new Elysia({ name: "Service.Auth" })
	.guard({
		cookie: Schema.cookie.session,
	})
	.resolve(async ({ cookie: { sessionId } }) => {
		const { user, session } = await validateSessionToken(sessionId.value);
		return { user, session };
	})
	.onBeforeHandle(({ user, session, error, cookie: { sessionId } }) => {
		if (!user || !session) {
			sessionId.remove();
			return error("Unauthorized", "The provided sessionId is invalid");
		}
	})
	.resolve(({ user, session, cookie: { sessionId } }) => {
		// We can safely cast the types here because
		// sessionId was validated in the previous onBeforeHandle hook
		user = user as User;
		session = session as Session;

		setSessionTokenCookie(sessionId, sessionId.value, session.expires_at);

		return { user, session };
	})
	.as("plugin");
