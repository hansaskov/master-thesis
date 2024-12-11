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
			return await Queries.systems.create({ 
				name: body.name, 
				organization_id: body.organization_id,
				system_model_id: body.system_model_id, 
			});
		},
        {
			body: t.Object({
				name: Schema.insert.systems.name,
                organization_id: Schema.insert.systems.organization_id,
				system_model_id: t.Optional(Schema.insert.systems.system_model_id),
			}),
		},
	)
	.delete(
		"/",
		async ({ body }) => {

			const result = await Queries.systems.delete({ id: body.id });

			if (result === undefined) {
				return error(
					"Not Found",
					"Cannot delete, because production system was not found",
				);
			}

			return result;
		},
		{
			body: t.Object({
				id: Schema.select.systems.id,
			}),
		},
	);
