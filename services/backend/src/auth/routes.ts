import Elysia, { Cookie, t } from "elysia";
import { Schema } from "../db/model";
import { githubRoute } from "./login/github";
import { logoutRoutes } from "./logout";
import { Authenticate } from "./lucia";

const loginRoutes = new Elysia({ prefix: "/login" }).use(githubRoute);

export const authRoutes = new Elysia()
	.use(loginRoutes)
	.use(logoutRoutes)
	.get(
		"/status",
		async ({ cookie: { sessionId } }) => {
			const { session, user } = await Authenticate(sessionId);

			if (session) return `You are authenticated as github user: ${user}`;

			return "You are not authenticated";
		},
		{
			cookie: Schema.cookie.session,
		},
	);
