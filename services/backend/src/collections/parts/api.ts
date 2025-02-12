import { Queries } from "$collections/queries";
import { Schema } from "$collections/schema";
import Elysia, { error, t } from "elysia";
import { authMiddleware } from "$auth/middleware";

export const partsApi = new Elysia({ prefix: "parts" })
	.use(authMiddleware)
	.get("/", async ({ user }) => {
		if (!user.is_superadmin) {
			return error(
				"Unauthorized",
				"Only superadmins are allowed to select all parts",
			);
		}

		return await Queries.part.selectAll();
	})
	.patch(
		"/",
		async ({ user, body }) => {
			if (!user.is_superadmin) {
				return error(
					"Unauthorized",
					"Only superadmins are allowed to select all parts",
				);
			}

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
		},
	)
	.post(
		"/",
		async ({ user, body }) => {
			if (!user.is_superadmin) {
				return error(
					"Unauthorized",
					"Only superadmins are allowed to create parts",
				);
			}

			return await Queries.part.create(body);
		},
		{
			body: t.Object({
				name: Schema.insert.parts.name,
			}),
		},
	)
	.post(
		"/system_models",
		async ({ user, body }) => {
			if (!user.is_superadmin) {
				return error(
					"Unauthorized",
					"Only superadmins are allowed to assign parts to system models",
				);
			}
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
		},
	);
