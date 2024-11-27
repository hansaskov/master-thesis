import Elysia from "elysia";
import { AuthService } from "../../../auth/middleware";
import { Queries } from "../../model";

const organizationsApi = new Elysia({ prefix: "organization" })
	.use(AuthService)
	.post("/", ({ user }) => "Hello ");
