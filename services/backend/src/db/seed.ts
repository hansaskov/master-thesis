import { Table } from "$collections/index";
import { db } from "./postgres";

export async function seedDatabase() {
	// Start a transaction
	const result = await db.transaction(async (tx) => {
		// Insert organization
		const organization = await tx
			.insert(Table.organizations)
			.values([{ name: "Trivision" }])
			.returning()
			.then((v) => v.at(0));

		if (!organization) {
			throw new Error("Failed to insert organization");
		}

		// Insert system
		const system = await tx
			.insert(Table.systems)
			.values([
				{
					name: "VisioPointer",
					organization_id: organization.id,
					system_model: "VisioPointer",
				},
			])
			.returning()
			.then((v) => v.at(0));

		if (!system) {
			throw new Error("Failed to insert system");
		}

		// Insert key
		const key = await tx
			.insert(Table.keys)
			.values([{ private_key: system.id }])
			.returning()
			.then((v) => v.at(0));

		if (!key) {
			throw new Error("Failed to insert key");
		}

		// Insert readings.
		const readings = await tx
			.insert(Table.readings)
			.values([
				{
					name: "cpu temperature",
					time: new Date(),
					unit: "C",
					value: 40,
					system_id: system.id,
				},
				{
					name: "cpu usage",
					time: new Date(),
					unit: "%",
					value: 20,
					system_id: system.id,
				},
				{
					name: "disk usage",
					time: new Date(),
					unit: "%",
					value: 95,
					system_id: system.id,
				},
			])
			.returning();

		return { organization, system, key, readings };
	});

	return result;
}

/* Execute the seeding
try {
	const result = await seedDatabase();
	console.log("Database seeded successfully:", result);
	exit(0);
} catch (error) {
	console.error("Failed to seed database:", error);
	throw error;
}
*/
