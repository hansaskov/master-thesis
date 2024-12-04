import Elysia from "elysia";
import { organizationsApi } from "../db/tables/organizations/api";
import { microsoftRoute } from "./login/microsoft";
import { logoutRoutes } from "./logout";
import { statusRoutes } from "./status";
const loginRoutes = new Elysia({ prefix: "/login" }).use(microsoftRoute);

export const authRoutes = new Elysia()
	.use(loginRoutes)
	.use(logoutRoutes)
	.use(statusRoutes)
	.use(organizationsApi);
