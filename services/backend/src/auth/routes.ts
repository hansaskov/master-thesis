import Elysia, { Cookie, t } from "elysia";
import { githubRoute } from "./login/github";
import { Queries } from "../db/model";
import { deleteSessionTokenCookie, setSessionTokenCookie, validateSessionToken } from "./lucia";

const loginRoutes = new Elysia({ prefix: "/login" }).use(githubRoute);

export const authRoutes = new Elysia().use(loginRoutes);



export async function Authenticate(cookie: Cookie<string>) {

    const token = cookie.value;

	const { session, user } = await validateSessionToken(token);
	if (session !== null) {
		setSessionTokenCookie(cookie, token, session.expires_at);
	} else {
		deleteSessionTokenCookie(cookie);
	}

	return { session, user};


}