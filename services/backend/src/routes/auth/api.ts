import Elysia from "elysia";
import { loginApi } from "./login/api";
import { logoutApi } from "./logout/api";
import { statusApi } from "./status/api";

export const authApi = new Elysia().use(loginApi).use(logoutApi).use(statusApi);
