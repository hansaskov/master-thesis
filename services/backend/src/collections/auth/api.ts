import Elysia from "elysia";
import { logoutApi } from "./logout/api";
import { statusApi } from "./status/api";
import { loginApi } from "./login/api";

export const authApi = new Elysia()
	.use(loginApi)
	.use(logoutApi)
	.use(statusApi);
