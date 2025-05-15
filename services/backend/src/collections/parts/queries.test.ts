import { describe, expect, it } from "bun:test";
import { Queries } from "$collections/queries";

describe("Part Queries", async () => {
  it("Create & selectAll should return the newly created part", async () => {
    // 1. Create a new part
    const newPart = await Queries.part.create({ name: "Test Part", image: "http://example.com/img.png" });

    expect(newPart.id).toBeDefined();
    expect(newPart.name).toBe("Test Part");
    expect(newPart.image).toBe("http://example.com/img.png");

    // 2. selectAll should include this part
    const allParts = await Queries.part.selectAll();
    expect(allParts).toContainEqual(
      expect.objectContaining({ id: newPart.id, name: "Test Part" })
    );
  });

  it("Update should modify an existing part", async () => {
    // First create
    const part = await Queries.part.create({ name: "Old Name", image: "" });

    // Then update
    const updated = await Queries.part.update({
      id: part.id,
      name: "New Name",
      image: "http://example.com/new.png",
    });

    expect(updated).not.toBeNull();
    expect(updated!.id).toBe(part.id);
    expect(updated!.name).toBe("New Name");
    expect(updated!.image).toBe("http://example.com/new.png");
  });

  it("Delete should remove the part", async () => {
    const part = await Queries.part.create({ name: "To Be Deleted", image: "" });

    const deleted = await Queries.part.delete({ id: part.id });
    expect(deleted).not.toBeNull();
    expect(deleted!.id).toBe(part.id);

    // Confirm it's really gone
    const remaining = await Queries.part.selectAll();
    expect(remaining.find((p) => p.id === part.id)).toBeUndefined();
  });

  it("assignToSystemModel should link a part to a system model", async () => {
    const part = await Queries.part.create({ name: "Linked Part", image: "" });
    const systemModels = await Queries.systemModels.selectAll();
    if (systemModels.length === 0) {
      console.log("No system models to assign parts to");
      return;
    }
    const systemModelId = systemModels[0].id; 

    const link = await Queries.part.assignToSystemModel({
      part_id: part.id,
      system_model_id: systemModelId,
    });

    expect(link).toEqual(
      expect.objectContaining({
        part_id: part.id,
        system_model_id: systemModelId,
      })
    );

    // Optionally, verify via direct partsToSystemModels query
    // const rows = await Queries.partsToSystemModels.select({ part_id: part.id });
    // expect(rows).toContainEqual(
    //   expect.objectContaining({ system_model_id: systemModelId })
    // );
  });

  it("getBySystem should return parts assigned to a given system", async () => {
    // 1. Create a system
    const testOrg = await Queries.organizations.create({name: "test org"})
    const system = await Queries.systems.create({ name: "Test System", organization_id: testOrg.id, system_model: "VisioPointer" });

    // 2. Create two parts
    const partA = await Queries.part.create({ name: "Part A", image: "" });
    const partB = await Queries.part.create({ name: "Part B", image: "" });

    // 3. Link them via systems_to_parts
    await Queries.systemsToParts.create({
      system_id: system.id,
      parts_id: partA.id,
    });
    await Queries.systemsToParts.create({
      system_id: system.id,
      parts_id: partB.id,
    });

    // 4. Fetch via getBySystem
    const linkedParts = await Queries.part.getBySystem(system.id);
    // Expect exactly A and B
    const ids = linkedParts.map((p) => p.parts.id);
    expect(ids).toContain(partA.id);
    expect(ids).toContain(partB.id);
    expect(ids).toHaveLength(2);
  });
});
