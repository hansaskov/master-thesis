import { describe, expect, it } from "bun:test";
import { Queries } from "$collections/queries";
import { generateRandomString } from "$utils/random";

describe("system model queries", async () => {
    it("select all parts for system model", async () => {
        const system_model = await Queries.systemModels.selectOnId({id: 'Dgw8Rvd4QoeC'});
    
        const part = await Queries.part.create({name: 'Frozen Pizza'});
        const part2 = await Queries.part.create({name: 'Some Camera'});

        const relationship1 = await Queries.partsToSystemModels.create({part_id: part.id, system_model_id: system_model[0].id})
        const relationship2 = await Queries.partsToSystemModels.create({part_id: part2.id, system_model_id: system_model[0].id})

        const all_models_with_all_parts = await Queries.systemModels.selectAll()
        console.log(all_models_with_all_parts);
        const firstSystemModel = all_models_with_all_parts[0]

        expect(system_model.length).toEqual(1)
        expect(all_models_with_all_parts.length).toEqual(7)
        expect(firstSystemModel.id).toBeDefined()
        expect(firstSystemModel.name).toBeDefined()
        expect(firstSystemModel.parts).toBeArray()
    })
})