import { describe, expect, it } from "bun:test";
import { c } from "..";

async function seedDatabase() {
	// Date used throughout
	const startDate = new Date(1999, 9, 27);

	// Insert organization
	const organization = await c.organizations.insertOne({
		name: "Trivision",
	});

	// Insert system
	const system = await c.systems.insertOne({
		name: "VisioPointer",
		organization_id: organization.id,
		system_model: "VisioPointer",
	});

	// Insert readings.
	const readings = await c.readings.insertMany([
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

	return { organization, system, readings };
}

describe("Systems", async () => {
	it("select all with health", async () => {
		// Seed test wit data
		const seedData = await seedDatabase();

		// Insert threshold
		await c.thresholds.insertOne({
			enabled: true,
			threshold: 80,
			...seedData.readings[0],
		});

		// Create query we wish to perform.
		const drizzleQuery = c.systems.selectAllWithHealth(seedData.organization);

		// Print the actual SQL
		// console.log(drizzleQuery.toSQL());

		// Query systems with health
		const systems = await drizzleQuery;

		// Expect 1 system
		expect(systems).toBeArrayOfSize(1);

		// Expect 1 reading
		expect(systems[0].latest_readings).not.toBeNull();
		expect(systems[0].latest_readings).toBeArrayOfSize(1);

		if (!systems[0].latest_readings) {
			throw Error;
		}

		// Expect reading to be healthy
		expect(systems[0].latest_readings[0].healthy).toBeTrue();
	});

	it("select with no thresholds", async () => {
		// Seed test wit data
		const seedData = await seedDatabase();

		// Insert no threshold

		// Query systems with health
		const systems = await c.systems.selectAllWithHealth(seedData.organization);

		// Expect 1 system
		expect(systems).toBeArrayOfSize(1);

		// Expect 0 readings
		expect(systems[0].latest_readings).toBeNull();
	});
});
