import { Schema } from "$db/collection";
import Elysia, { error, redirect, t } from "elysia";
import {
	Authenticate,
	deleteSessionTokenCookie,
	invalidateSession,
} from "./lucia";

export const logoutRoutes = new Elysia().get(
	"/logout",
	async ({ cookie: { sessionId } }) => {
		const { session } = await Authenticate(sessionId);

		if (!session) {
			return error(401);
		}

		await invalidateSession(session.id);
		deleteSessionTokenCookie(sessionId);
		return redirect("/", 302);
	},
	{
		cookie: Schema.cookie.session,
	},
);
