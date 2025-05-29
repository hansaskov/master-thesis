import { deleteSessionTokenCookie, invalidateSession } from "$auth/lucia";
import { AuthService } from "$auth/middleware";
import Elysia, { redirect } from "elysia";

export const logoutApi = new Elysia()
	.use(AuthService)
	.get("/logout", async ({ session, cookie: { sessionId } }) => {
		await invalidateSession(session.id);
		deleteSessionTokenCookie(sessionId);
		return redirect("/", 302);
	});
