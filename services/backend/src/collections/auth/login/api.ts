import Elysia from "elysia";
import { microsoftApi } from "./microsoft/api";

export const loginApi = new Elysia({ prefix: "/login" }).use(microsoftApi);
