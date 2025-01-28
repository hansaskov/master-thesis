import { AuthService } from "$auth/middleware";
import Elysia from "elysia";

export const statusApi = new Elysia()
	.use(AuthService)
	.get(
		"/status",
		({ user }) =>
			`You are authenticated with ${user.provider_name} as user: ${user.provider_id}`,
	)
	.get("/refresh", ({ user }) => user);
