// import { describe, expect, it } from "bun:test";
// import { Queries } from "$collections/queries";
// import { db } from "$db/postgres";
// import { eq } from "drizzle-orm";

// describe("systemsToPartsQueries", () => {
//   it("create should link a single part to a system", async () => {
//     // 1. Create the FK parents
//     const system = await Queries.systems.create({ name: "Test System" });
//     const part = await Queries.part.create({ name: "Test Part", image: "" });

//     // 2. Call create()
//     const link = await systemsToPartsQueries.create({
//       system_id: system.id,
//       parts_id: part.id,
//     });

//     // 3. Assert returned row
//     expect(link).toEqual(
//       expect.objectContaining({
//         system_id: system.id,
//         parts_id: part.id,
//       })
//     );
//   });

//   it("createBatch should insert multiple links in one go", async () => {
//     // 1. Create FK parents
//     const system = await Queries.systems.create({ name: "Batch System" });
//     const partA = await Queries.part.create({ name: "Part A", image: "" });
//     const partB = await Queries.part.create({ name: "Part B", image: "" });

//     // 2. Call createBatch()
//     await systemsToPartsQueries.createBatch([
//       { system_id: system.id, parts_id: partA.id },
//       { system_id: system.id, parts_id: partB.id },
//     ]);

//     // 3. Verify both links exist
//     const rows = await db
//       .select()
//       .from(systemsToParts)
//       .where(eq(systemsToParts.system_id, system.id));

//     const linkedPartIds = rows.map((r) => r.parts_id);
//     expect(linkedPartIds).toContain(partA.id);
//     expect(linkedPartIds).toContain(partB.id);
//     expect(linkedPartIds).toHaveLength(2);
//   });
// });
