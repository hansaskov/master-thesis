import Elysia, { error, t } from "elysia";
import { Queries, Schema } from "..";
import { AuthService } from "../../../auth/middleware";

export const partsApi = new Elysia({ prefix: "parts" })
	.use(AuthService)
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

			const result = await Queries.organizations.update(body);

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
	.delete(
		"/",
		async ({ user, body }) => {
			if (!user.is_superadmin) {
				return error(
					"Unauthorized",
					"Only superadmins are allowed to delete parts",
				);
			}

			const result = await Queries.organizations.delete({ id: body.id });

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
