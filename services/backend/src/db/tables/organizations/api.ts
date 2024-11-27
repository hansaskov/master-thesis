import Elysia, { t } from "elysia";
import { AuthService } from "../../../auth/middleware";
import { Queries, Schema } from "../../model";

const organizationsApi = new Elysia({ prefix: "organization" })
	.use(AuthService)
	.post("/", ({ user, query }) => Queries.organizations.update(query), {
		query: t.Object({
			name: t.Optional(Schema.select.organizations.name),
			id: Schema.select.organizations.id,
		}),
	});
