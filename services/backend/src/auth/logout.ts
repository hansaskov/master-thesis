import Elysia, { error, redirect, t } from "elysia";
import { deleteSessionTokenCookie, invalidateSession } from "./lucia";
import { AuthService } from "./middleware";

export const logoutRoutes = new Elysia()
	.use(AuthService)
	.get("/logout", async ({ session, cookie: { sessionId } }) => {
		await invalidateSession(session.id);
		deleteSessionTokenCookie(sessionId);
		return redirect("/", 302);
	});
