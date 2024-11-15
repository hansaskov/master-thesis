import Elysia from "elysia";
import { githubRoute } from "./login/github";

const loginRoutes = new Elysia({ prefix: "/login" }).use(githubRoute);

export const authRoutes = new Elysia().use(loginRoutes);
