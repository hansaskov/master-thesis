import { generateCodeVerifier, generateState } from "arctic";
import { MicrosoftEntraId } from "arctic";
import { Elysia, error, redirect, t } from "elysia";
import { TypeCompiler } from "elysia/type-system";
import { environment } from "../../../../config/environment";

import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import { convertKeys } from "$utils/transform";
import {
	createSession,
	generateSessionToken,
	setSessionTokenCookie,
} from "../../../../auth/lucia";
import { catchError } from "../../../../types/errors";

export const entraId = new MicrosoftEntraId(
	environment.MICROSOFT_TENANT_ID,
	environment.MICROSOFT_CLIENT_ID,
	environment.MICROSOFT_CLIENT_SECRET,
	new URL(
		"/api/login/microsoft/callback",
		environment.INTERFACE_FQDN,
	).toString(),
);

export const microsoftApi = new Elysia()
	.get(
		"/microsoft",
		({ cookie }) => {
			const state = generateState();
			const codeVerifier = generateCodeVerifier();
			const scopes = ["openid", "profile", "email"];

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
						Scope: "email profile openid",
					},
				},
			).then((r) => r.json());

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

			const name =
				userParsed.name || userParsed.familyname || userParsed.givenname;
			if (!name) {
				const errorMessage = "No name found for user";

				console.error(errorMessage);
				return error(500, errorMessage);
			}

			const user = await Queries.users.create({
				provider_name: "Microsoft",
				provider_id: userParsed.sub,
				name: name,
				email: userParsed.email,
				image: userParsed.picture,
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
	name: t.Optional(t.String()),
	familyname: t.Optional(t.String()),
	givenname: t.Optional(t.String()),
	locale: t.Optional(t.String()),
	picture: t.Optional(t.String()),
	email: t.Optional(t.String()),
});

const validateUser = TypeCompiler.Compile(UserSchema);
