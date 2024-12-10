import Elysia, { error, t } from "elysia";
import { AuthService } from "../../../auth/middleware";
import { Queries, Schema } from "../../model";

export const systemsApi = new Elysia({ prefix: "systems" })
    .get("/", async () => {
        return await Queries.systems.selectAll();
    })
    .post(
		"/",
		async ({ body }) => {
			return await Queries.systems.create({ name: body.name, organization_id: body.organization_id });
		},
        {
			body: t.Object({
				name: Schema.insert.systems.name,
                organization_id: Schema.insert.systems.organization_id
			}),
		},
	)