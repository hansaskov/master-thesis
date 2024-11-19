import Elysia, { Cookie, t } from "elysia";
import { Schema } from "../db/model";
import { Authenticate } from "./lucia";
import { AuthService } from "./middleware";

export const statusRoutes = new Elysia()
	.use(AuthService)
	.get("/status", ({ user }) => `You are authenticated with ${user.provider_name} as user: ${user.provider_id}`);
