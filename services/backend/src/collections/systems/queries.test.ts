import { describe, expect, it } from "bun:test";
import { Queries } from "$collections/queries";

async function seedDatabase() {
	// Date used throughout
	const startDate = new Date(1999, 9, 27);

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

	// Insert readings.
	const readings = await Queries.readings.createMany([
		{
			name: "cpu usage",
			time: new Date(startDate.getTime() + 1000), // +1 second
			unit: "%",
			value: 50,
			system_id: system.id,
		},
		{
			name: "cpu usage",
			time: new Date(startDate.getTime() + 2000), // +2 seconds
			unit: "%",
			value: 60,
			system_id: system.id,
		},
		{
			name: "cpu usage",
			time: new Date(startDate.getTime() + 3000), // +3 seconds
			unit: "%",
			value: 70,
			system_id: system.id,
		},
	]);

	// Insert threshold
	const threshold = await Queries.threshold.insert({
		enabled: true,
		threshold: 80,
		...readings[0],
	});

	return { organization, system, readings, threshold };
}

describe("Systems", async () => {
	it("select all with health", async () => {
		// Seed test wit data
		const seedData = await seedDatabase();

		// Query systems with health
		const systems = await Queries.systems.selectSystemsWithHealth(
			seedData.organization,
		);

		// Expect 1 system
		expect(systems).toBeArrayOfSize(1);
		expect(systems[0]).toBeDefined();

		// Expect 1 reading
		expect(systems[0].latest_readings).toBeArrayOfSize(1);

		// Expect reading to be healthy
		expect(systems[0].latest_readings[0].healthy).toBeArrayOfSize(1);
	});
});
