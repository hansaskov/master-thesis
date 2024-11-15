import { generateState } from "arctic";
import { GitHub } from "arctic";
import { type Cookie, Elysia, error, redirect, t } from "elysia";
import { Queries } from "../../db/model";
import { catchError } from "../../types/errors";
import { createSession, generateSessionToken, setSessionTokenCookie } from "../lucia";

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
	throw new Error("Missing Github client id and secred from environment variables");
}

export const github = new GitHub(process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET, null);

export const githubRoute = new Elysia()
	.get("/microsoft", ({ cookie: { github_oauth_state } }) => {
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
		"/microsoft/callback",
		async ({ query: { code, state }, cookie: { github_oauth_state } }) => {
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
