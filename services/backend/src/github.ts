import { generateState } from "arctic";
import { GitHub } from "arctic";
import { type Cookie, Elysia, error, redirect, t } from "elysia";
import { createSession, generateSessionToken } from "./auth";
import { Queries } from "./db/model";
import { catchError } from "./types/errors";

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
	throw new Error("Missing Github client id and secred from environment variables");
}

if (!process.env.PROD) {
	throw new Error("PROD environment variable is required but not set");
}
const IS_PROD = process.env.PROD.toLowerCase() === "true";

export const github = new GitHub(process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET, null);

export const githubRoute = new Elysia()
	.get("/login/github", ({ cookie: { github_oauth_state } }) => {
		const state = generateState();
		const url = github.createAuthorizationURL(state, []);

		github_oauth_state.cookie = {
			value: state,
			path: "",
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: "lax",
		};

		return redirect(url.toString(), 302);
	})
	.get(
		"/login/github/callback",
		async ({ query: { code, state }, cookie: {github_oauth_state}  }) => {

			if (state !== github_oauth_state.value) {
				return error(400);
			}


			const [err, tokens] = await catchError(github.validateAuthorizationCode(code));
			if (err) {
				return error(400);
			}

			const githubUserResponse = await fetch("https://api.github.com/user", {
				headers: {
					Authorization: `Bearer ${tokens.accessToken()}`,
				},
			});

			const { id: githubId, login: githubUsername } = (await githubUserResponse.json()) as {
				id?: string;
				login?: string;
			};

			if (!githubId || !githubUsername) {
				return error(500, "Not able to parse github id and login");
			}

			const existingUser = await Queries.users.selectUniqueWithMicrosoftId(githubId);

			if (existingUser) {
				const sessionToken = generateSessionToken();
				const session = await createSession(sessionToken, existingUser.id);
				setSessionTokenCookie(github_oauth_state, sessionToken, session.expires_at);

				return redirect("/api/swagger", 302);
			}

			const user = await Queries.users.create({ microsoft_id: githubId });

			const sessionToken = generateSessionToken();
			const session = await createSession(sessionToken, user.id);
			setSessionTokenCookie(github_oauth_state, sessionToken, session.expires_at);

			return redirect("/api/swagger", 302);
		},
		{
			query: t.Object({
				code: t.String(),
				state: t.String(),
			}),
			cookie: t.Cookie({
				github_oauth_state: t.String(),
			}),
		},
	);

function setSessionTokenCookie(cookie: Cookie<string>, sessionToken: string, expiresAt: Date) {
	cookie.cookie = {
		value: sessionToken,
		httpOnly: true,
		sameSite: "lax",
		secure: IS_PROD,
		expires: expiresAt,
		maxAge: 60 * 10,
		path: "/",
	};
}
