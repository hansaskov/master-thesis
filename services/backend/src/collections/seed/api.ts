import { Queries } from "$collections/queries";
import { environment } from "$config/environment";
import Elysia, { error, t } from "elysia";


export const seedApi = new Elysia({ prefix: "seed" }).post("/", async () => {
	if (!environment.IS_TEST) {
		return error(
			"Unauthorized",
			"IS_TEST variable is disabled and this endpoint is not accessable",
		);
	}

	// Insert Org
	const organization = await Queries.organizations.create({
		name: "Trivision",
	});

	// Insert system
	const system = await Queries.systems.create({
		name: "VisioPointer",
		organization_id: organization.id,
		system_model: "VisioPointer",
	});

	// Insert key
	const key = await Queries.keys.create({
		system_id: system.id,
		name: "Key from seed api",
	});

	return { key };
});
