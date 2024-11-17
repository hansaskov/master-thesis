import Elysia, { Cookie, t } from "elysia";
import { Schema } from "../db/model";
import { githubRoute } from "./login/github";
import { logoutRoutes } from "./logout";
import { Authenticate } from "./lucia";
import { microsoftRoute } from "./login/microsoft";

const loginRoutes = new Elysia({ prefix: "/login" })
	.use(githubRoute)
	.use(microsoftRoute);

export const authRoutes = new Elysia()
	.use(loginRoutes)
	.use(logoutRoutes)
	.get(
		"/status",
		async ({ cookie: { sessionId } }) => {

			if (!sessionId.value) {
				return "You are not authenticated";
			}

			const { session, user } = await Authenticate(sessionId as Cookie<string>);

			if (session) return `You are authenticated as user: ${user?.microsoft_id}`;

			return "Something went wrong";
		},
		{
			cookie: t.Partial(Schema.cookie.session),
		},
	);
