import { generateCodeVerifier, generateState } from "arctic";
import { MicrosoftEntraId } from "arctic";
import { Elysia, error, redirect, t } from "elysia";
import { TypeCompiler } from "elysia/type-system";
import { environment } from "../../config/environment";

import { Queries, Schema } from "$db/collections";
import { catchError } from "../../types/errors";
import {
	createSession,
	generateSessionToken,
	setSessionTokenCookie,
} from "../lucia";
import { convertKeys } from "$utils/transform";

export const entraId = new MicrosoftEntraId(
	environment.MICROSOFT_TENANT_ID,
	environment.MICROSOFT_CLIENT_ID,
	environment.MICROSOFT_CLIENT_SECRET,
	environment.MICROSOFT_REDIRECT_URI,
);

export const microsoftRoute = new Elysia()
	.get(
		"/microsoft",
		({ cookie }) => {
			const state = generateState();
			const codeVerifier = generateCodeVerifier();
			const scopes = ["openid", "profile"];

			const url = entraId.createAuthorizationURL(state, codeVerifier, scopes);

			cookie.microsoftState.value = state;
			cookie.microsoftCode.value = codeVerifier;

			return redirect(url.toString(), 302);
		},
		{
			cookie: t.Partial(Schema.cookie.microsoft),
		},
	)
	.get(
		"/microsoft/callback",
		async ({ query: { code, state }, cookie }) => {
			// Verify that the state is the same as the one we set in the cookie
			if (state !== cookie.microsoftState.value) {
				return error(400);
			}

			// Call the microsoft API to get validate authorization code
			const codeVerifier = cookie.microsoftCode.value;

			const [err, tokens] = await catchError(
				entraId.validateAuthorizationCode(code, codeVerifier),
			);

			if (err) {
				return error(400, err);
			}

			// Call the microsoft API to get user info
			const userResponse = await fetch(
				"https://graph.microsoft.com/oidc/userinfo",
				{
					headers: {
						Authorization: `Bearer ${tokens.accessToken()}`,
					},
				},
			).then((r) => r.json() as Record<string, any>);

			console.log(userResponse);

			const parsedUserResponse = convertKeys(userResponse);

			console.log(parsedUserResponse);

			if (!validateUser.Check(parsedUserResponse)) {
				const errorMessage = `Server Failed to parse response when getting user info from microsoft. Expected schema: ${UserSchema.description}, Actual schema: ${parsedUserResponse}`;

				console.error(errorMessage);
				return error(500, errorMessage);
			}

			const userParsed = validateUser.Decode(parsedUserResponse);

			const existingUser = await Queries.users.selectUniqueWithProvider({
				provider_name: "Microsoft",
				provider_id: userParsed.sub,
			});

			if (existingUser) {
				const sessionToken = generateSessionToken();
				const session = await createSession(sessionToken, existingUser.id);

				setSessionTokenCookie(
					cookie.sessionId,
					sessionToken,
					session.expires_at,
				);

				return redirect("/organization", 302);
			}

			const user = await Queries.users.create({
				provider_name: "Microsoft",
				provider_id: userParsed.sub,
			});

			const sessionToken = generateSessionToken();
			const session = await createSession(sessionToken, user.id);
			setSessionTokenCookie(cookie.sessionId, sessionToken, session.expires_at);

			return redirect("/organization", 302);
		},
		{
			query: t.Object({
				code: t.String(),
				state: t.String(),
			}),
			cookie: t.Cookie({
				microsoftState: t.String(),
				microsoftCode: t.String(),
			}),
		},
	);

const UserSchema = t.Object({
	sub: t.String(),
	familyname: t.Optional(t.String()),
	givenname: t.Optional(t.String()),
	locale: t.Optional(t.String()),
	picture: t.Optional(t.String()),
});

const validateUser = TypeCompiler.Compile(UserSchema);
