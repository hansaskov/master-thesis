import { describe, expect, it } from "bun:test";
import { Queries } from "$collections/queries";
import { generateRandomString } from "$utils/random";

describe("system model queries", async () => {
	it("select all parts for system model", async () => {
		const all_models_with_all_parts = await Queries.systemModels.selectAll();
		expect(all_models_with_all_parts.length).toEqual(7);

		const testSystemModel = await Queries.systemModels.create({
			name: "VisioPointer",
		});

		const part = await Queries.part.create({ name: "Frozen Pizza" });
		const part2 = await Queries.part.create({ name: "Some Camera" });

		const firstSystemModel = all_models_with_all_parts[0];

		expect(firstSystemModel.id).toBeDefined();
		expect(firstSystemModel.name).toBeDefined();
		expect(firstSystemModel.parts).toBeArray();

		await Queries.systemModels.delete(testSystemModel);
		await Queries.part.delete(part);
		await Queries.part.delete(part2);
	});
});
