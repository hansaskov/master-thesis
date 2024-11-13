import { MicrosoftEntraId } from "arctic";
import { decodeIdToken, generateCodeVerifier, generateState } from "arctic";
import { ArcticFetchError, OAuth2RequestError } from "arctic";
import { Elysia } from "elysia";

if (!process.env.TENANT_ID || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.REDIRECT_URI) {
	throw new Error("Missing required environment variables");
}

const config = {
	tenant: process.env.TENANT_ID,
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	redirectUri: process.env.REDIRECT_URI,
};

const entraId = new MicrosoftEntraId(config.tenant, config.clientId, config.clientSecret, config.redirectUri);

const stateStore = new Map<string, { codeVerifier: string; redirect?: string }>();

export const user = new Elysia()
	.get("/login", ({ query, set, redirect }) => {
		const state = generateState();
		const codeVerifier = generateCodeVerifier();
		const scopes = ["openid", "profile"];

		// Store state, code verifier, and our original URL
		// State: Generate random string used to prevent CSRF attacks
		// CodeVerifier: Generate random string used for PKCE to prevent authorization code attacks
		stateStore.set(state, {
			codeVerifier,
			redirect: query.redirect as string,
		});

		// Create authorization URL
		const url = entraId.createAuthorizationURL(state, codeVerifier, scopes);
		console.log(url);

		return redirect(url.toString());
	})

	.get("/auth/callback", async ({ query, redirect, cookie: { name } }) => {
		const { code, state } = query;

		const stateData = stateStore.get(state as string);
		if (!stateData) {
			return new Response("Invalid state", { status: 400 });
		}

		const { codeVerifier } = stateData;

		try {
			const tokens = await entraId.validateAuthorizationCode(code as string, codeVerifier);
			const accessToken = tokens.accessToken();
			const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
			const refreshToken = tokens.refreshToken();

			// Get user info from ID token. Currently we do not use this but it's possible.
			const idToken = tokens.idToken();
			if (idToken) {
				const claims = decodeIdToken(idToken);
				console.log("User claims:", claims);
			}

			// Set the cookie name
			// Reactive cookies can be set without worrying about encoding/decoding https://elysiajs.com/patterns/cookie
			name.value = accessToken;

			const redirectUri = stateData.redirect || "/";

			return redirect(redirectUri);
		} catch (e) {
			if (e instanceof OAuth2RequestError) {
				console.error("OAuth2 request error:", e);
				return new Response("OAuth2 request error", { status: 500 });
			}
			if (e instanceof ArcticFetchError) {
				console.error("Error fetching data from Arctic:", e);
				return new Response("Arctic service error", { status: 500 });
			}

			console.error("Unexpected error:", e);
			return new Response("Authorization failed", { status: 500 });
		}
	});
