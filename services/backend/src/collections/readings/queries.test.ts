import { beforeAll, describe, expect, it } from "bun:test";
import { Queries } from "$collections/queries";

async function seedDatabase() {
	// Insert organization
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
		name: "Test key 1",
	});

	// Insert readings.
	const readings = await Queries.readings.createMany([
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
	]);

	return { organization, system, key, readings };
}

describe("Readings Query", async () => {
	it("Select All Unique Latest", async () => {
		// Create localized data
		const seedData = await seedDatabase();

		// Get initial values
		const initialValues = await Queries.readings.selectAllUniqueLatest({
			system_id: seedData.system.id,
		});

		// Expect three values
		expect(initialValues).toBeArray();
		expect(initialValues).toHaveLength(3);

		// Sleep to ensure different timestamps
		await new Promise((resolve) => setTimeout(resolve, 1));

		// Add new readings with updated values
		await Queries.readings.createMany([
			{
				name: "cpu temperature",
				time: new Date(),
				unit: "C",
				value: 45, // Updated value
				system_id: seedData.system.id,
			},
			{
				name: "cpu usage",
				time: new Date(),
				unit: "%",
				value: 25, // Updated value
				system_id: seedData.system.id,
			},
			{
				name: "disk usage",
				time: new Date(),
				unit: "%",
				value: 98, // Updated value
				system_id: seedData.system.id,
			},
		]);

		// Get updated values
		const updatedValues = await Queries.readings.selectAllUniqueLatest({
			system_id: seedData.system.id,
		});

		// Still expect three values (unique combinations)
		expect(updatedValues).toBeArray();
		expect(updatedValues).toHaveLength(3);
	});

	it("Filter Unique Latest by Category", async () => {
		// Create localized data
		const seedData = await seedDatabase();

		// Add readings in different categories
		await Queries.readings.createMany([
			{
				name: "memory usage",
				time: new Date(),
				unit: "%",
				value: 60,
				system_id: seedData.system.id,
				category: "Performance",
			},
			{
				name: "network throughput",
				time: new Date(),
				unit: "Mbps",
				value: 150,
				system_id: seedData.system.id,
				category: "Performance",
			},
		]);

		// Filter by Performance category
		const performanceReadings = await Queries.readings.selectAllUniqueLatest({
			system_id: seedData.system.id,
			category: "Performance",
		});

		// Should have 2 readings in Performance category
		expect(performanceReadings).toBeArray();
		expect(performanceReadings).toHaveLength(2);
	});
});
