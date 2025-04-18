import { describe, expect, it } from "bun:test";
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

describe("Threshold", async () => {
	it("Insert 1 threshold", async () => {
		const seedData = await seedDatabase();
		const seedReading = seedData.readings[0];

		const threshold = await Queries.threshold.insert({
			threshold: 10,
			enabled: true,
			...seedReading,
		});

		expect(seedReading.name).toEqual(threshold.name);
	});

	it("Insert 2 thresholds", async () => {
		const seedData = await seedDatabase();
		const seedReadings = seedData.readings.slice(0, 2);

		// Create the expected threshold objects
		const expectedThresholds = seedReadings.map((v) => ({
			threshold: 10,
			enabled: true,
			system_id: v.system_id,
			category: v.category,
			name: v.name,
			unit: v.unit,
		}));

		const thresholds = await Queries.threshold.insertMany(expectedThresholds);

		expect(thresholds).toHaveLength(2);

		// Verify each expected threshold is present in the response
		for (const expected of expectedThresholds) {
			expect(thresholds).toContainEqual(expected);
		}
	});

	it("select all unique without threshold with single value", async () => {
		const seedData = await seedDatabase();
		const seedReading = seedData.readings[0];

		const threshold = await Queries.threshold.insert({
			threshold: 10,
			enabled: true,
			...seedReading,
		});

		const uniqueWithoutThreshold =
			await Queries.threshold.selectAllUniqueWithoutThreshold({
				system_id: seedData.system.id,
			});

		expect(uniqueWithoutThreshold).toHaveLength(2);
	});

	it("select all unique without threshold with multiple values", async () => {
		const seedData = await seedDatabase();
		const seedReading = seedData.readings.slice(0, 2);

		const thresholds = await Queries.threshold.insertMany(
			seedReading.map((reading) => ({
				threshold: 10,
				enabled: true,
				...reading,
			})),
		);

		const uniqueWithoutThreshold =
			await Queries.threshold.selectAllUniqueWithoutThreshold({
				system_id: seedData.system.id,
			});

		expect(uniqueWithoutThreshold).toHaveLength(1);
	});
});

it("Toggle a threshold flips enabled status", async () => {
	const seedData = await seedDatabase();
	const seedReading = seedData.readings[0];

	// Insert threshold with enabled: true
	const inserted = await Queries.threshold.insert({
		threshold: 10,
		enabled: true,
		...seedReading,
	});

	// Toggle the threshold
	const toggled = await Queries.threshold.toggle({
		system_id: inserted.system_id,
		category: inserted.category, // Assumes code uses values.category (may need adjustment if code has typo)
		name: inserted.name,
		unit: inserted.unit,
	});

	expect(toggled.enabled).toBe(false);

	// Verify persistence by fetching thresholds
	const thresholds = await Queries.threshold.select({
		system_id: seedData.system.id,
	});
	const updated = thresholds.find((t) => t.name === inserted.name);
	expect(updated?.enabled).toBe(false);
});

it("Toggling twice reverts to original state", async () => {
	const seedData = await seedDatabase();
	const seedReading = seedData.readings[0];

	// Insert threshold with enabled: true
	const inserted = await Queries.threshold.insert({
		threshold: 10,
		enabled: true,
		...seedReading,
	});

	// First toggle (true -> false)
	await Queries.threshold.toggle({
		system_id: inserted.system_id,
		category: inserted.category,
		name: inserted.name,
		unit: inserted.unit,
	});

	// Second toggle (false -> true)
	const toggledAgain = await Queries.threshold.toggle({
		system_id: inserted.system_id,
		category: inserted.category,
		name: inserted.name,
		unit: inserted.unit,
	});

	expect(toggledAgain.enabled).toBe(true);

	// Verify persistence
	const thresholds = await Queries.threshold.select({
		system_id: seedData.system.id,
	});
	const updated = thresholds.find((t) => t.name === inserted.name);
	expect(updated?.enabled).toBe(true);
});
