import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { t } from "elysia";
import type { Cookie } from "elysia/cookies";
import { Queries } from "../db/model";
import type { Session, User } from "../db/tables";

if (!process.env.PROD) {
	throw new Error("PROD environment variable is required but not set");
}
const IS_PROD = process.env.PROD.toLowerCase() === "true";

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(token: string, user_id: string): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		user_id,
		expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
	};
	await Queries.sessions.create(session);
	return session;
}

export type SessionValidationResult = { session: Session; user: User } | { session: null; user: null };
export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = await Queries.sessions.selectWithUser(sessionId);

	if (!result) {
		return { session: null, user: null };
	}

	const { session, user } = result;
	if (Date.now() >= session.expires_at.getTime()) {
		await Queries.sessions.delete(sessionId);
		return { session: null, user: null };
	}
	if (Date.now() >= session.expires_at.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await Queries.sessions.update(session);
	}
	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await Queries.sessions.delete(sessionId);
}

export function setSessionTokenCookie(cookie: Cookie<string | undefined>, sessionToken: string, expiresAt?: Date) {
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

export function deleteSessionTokenCookie(cookie: Cookie<string>) {
	cookie.remove();
}

export async function Authenticate(cookie: Cookie<string>) {
	const token = cookie.value;

	const { session, user } = await validateSessionToken(token);
	if (session !== null) {
		setSessionTokenCookie(cookie, token, session.expires_at);
	} else {
		deleteSessionTokenCookie(cookie);
	}

	return { session, user };
}
