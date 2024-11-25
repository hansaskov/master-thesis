import Elysia from "elysia";

import { githubRoute } from "./login/github";
import { microsoftRoute } from "./login/microsoft";
import { logoutRoutes } from "./logout";
import { statusRoutes } from "./status";
const loginRoutes = new Elysia({ prefix: "/login" }).use(githubRoute).use(microsoftRoute);

export const authRoutes = new Elysia().use(loginRoutes).use(logoutRoutes).use(statusRoutes);
