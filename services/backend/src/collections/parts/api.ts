import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import Elysia, { error, t } from "elysia";
import { authMiddleware } from "$auth/middleware";

export const partsApi = new Elysia({ prefix: "parts" })
	.use(authMiddleware)
	.get("/", async ({ user }) => {
		return await Queries.part.selectAll();
	},
	{
		isSuperAdmin: true
	},
	)
	.patch(
		"/",
		async ({ user, body }) => {
			const result = await Queries.part.update(body);

			if (result === undefined) {
				return error("Not Found", "Part to edit was not found");
			}

			return result;
		},
		{
			body: t.Object({
				name: t.Optional(Schema.insert.organizations.name),
				id: Schema.select.organizations.id,
			}),
			isSuperAdmin: true
		},
	)
	.post(
		"/",
		async ({ user, body }) => {
			return await Queries.part.create(body);
		},
		{
			body: t.Object({
				name: Schema.insert.parts.name,
			}),
			isSuperAdmin: true
		},
	)
	.post(
		"/system_models",
		async ({ user, body }) => {
			try {
				return await Queries.part.assignToSystemModel(body);
			  } catch (err) {
				if (err && typeof err === 'object' && 'code' in err) {
					if (err.code === '23505') {
					  return error(
						"Conflict",
						"This part is already assigned to this system model"
					  );
					}
				}
				throw err;
			  }
		},
		{
			body: t.Object({
				part_id: Schema.select.part.id,
				system_model_id: Schema.select.part.id
			}),
			isSuperAdmin: true
		},
	)
	.delete(
		"/",
		async ({ user, body }) => {
			if (!user.is_superadmin) {
				return error(
					"Unauthorized",
					"Only superadmins are allowed to delete parts",
				);
			}

			const result = await Queries.part.delete({ id: body.id });

			if (result === undefined) {
				return error(
					"Not Found",
					"Cannot delete, because the part was not found",
				);
			}

			return result;
		},
		{
			body: t.Object({
				id: Schema.select.part.id,
			}),
			isSuperAdmin: true
		},
	);
