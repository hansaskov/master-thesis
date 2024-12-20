import { generateState } from "arctic";
import { GitHub } from "arctic";
import { type Cookie, Elysia, error, redirect, t } from "elysia";
import { Queries, Schema } from "../../db/model";
import { environment } from "../../environment";
import { catchError } from "../../types/errors";
import { createSession, generateSessionToken, setSessionTokenCookie } from "../lucia";

export const github = new GitHub(environment.GITHUB_CLIENT_ID, environment.GITHUB_CLIENT_SECRET, null);

export const githubRoute = new Elysia()
	.get(
		"/github",
		({ cookie: { githubState } }) => {
			const state = generateState();
			const url = github.createAuthorizationURL(state, []);

			githubState.value = state;

			return redirect(url.toString(), 302);
		},
		{
			cookie: t.Partial(Schema.cookie.github),
		},
	)
	.get(
		"/github/callback",
		async ({ query: { code, state }, cookie: { githubState, sessionId } }) => {
			if (state !== githubState.value) {
				return error(400);
			}

			const [err, tokens] = await catchError(github.validateAuthorizationCode(code));
			if (err) {
				return error(400, err);
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

			const existingUser = await Queries.users.selectUniqueWithProvider({
				provider_name: "Github",
				provider_id: githubId,
			});

			if (existingUser) {
				const sessionToken = generateSessionToken();
				const session = await createSession(sessionToken, existingUser.id);

				setSessionTokenCookie(sessionId, sessionToken, session.expires_at);

				return redirect("/api/status", 302);
			}

			const user = await Queries.users.create({ provider_name: "Github", provider_id: githubId });

			const sessionToken = generateSessionToken();
			const session = await createSession(sessionToken, user.id);
			setSessionTokenCookie(sessionId, sessionToken, session.expires_at);

			return redirect("/api/status", 302);
		},
		{
			query: t.Object({
				code: t.String(),
				state: t.String(),
			}),
			cookie: Schema.cookie.github,
		},
	);
