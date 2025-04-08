import { beforeAll, describe, expect, it } from "bun:test";
import { Queries } from "$collections/queries";
import { db } from "$db/postgres";
import { sql } from "drizzle-orm";

async function seedDatabase(startDate: Date) {
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
			name: "cpu usage",
			time: new Date(startDate.getTime() + 1000), // +1 second
			unit: "%",
			value: 10,
			system_id: system.id,
		},
		{
			name: "cpu usage",
			time: new Date(startDate.getTime() + 2000), // +2 seconds
			unit: "%",
			value: 20,
			system_id: system.id,
		},
		{
			name: "cpu usage",
			time: new Date(startDate.getTime() + 3000), // +3 seconds
			unit: "%",
			value: 30,
			system_id: system.id,
		},
	]);

	const threshold = await Queries.threshold.insert({
		enabled: true,
		threshold: 80,
		...readings[0],
	});

	return { organization, system, key, readings, threshold };
}

describe("System health", async () => {
	const startDate = new Date(1999, 9, 27); // October is month 9 (0-indexed)

	it("healthy", async () => {
		const seedData = await seedDatabase(startDate);

		// Insert readings over a 5 minutes interval, but all values are below 80
		const readings = await Queries.readings.createMany([
			{
				name: "cpu usage",
				time: new Date(startDate.getTime() + 4000), // +1 second
				unit: "%",
				value: 40,
				system_id: seedData.system.id,
			},
			{
				name: "cpu usage",
				time: new Date(startDate.getTime() + 5000), // +2 seconds
				unit: "%",
				value: 50,
				system_id: seedData.system.id,
			},
			{
				name: "cpu usage",
				time: new Date(startDate.getTime() + 6000), // +3 seconds
				unit: "%",
				value: 60,
				system_id: seedData.system.id,
			},
		]);

		// Query the latest value on system id
		const systemHealth = await Queries.systemHealth.selectLatest({
			system_id: seedData.system.id,
		});

		// Expect one value
		expect(systemHealth).toBeArrayOfSize(1);

		// Expect value to be healthy
		expect(systemHealth[0].healthy).toBeTrue();
	});

	it("unhealthy", async () => {
		const seedData = await seedDatabase(startDate);

		// Insert readings over a 5 minutes interval, the values are above 80% on average.
		const readings = await Queries.readings.createMany([
			{
				name: "cpu usage",
				time: new Date(startDate.getTime() + 4000), // +4 second
				unit: "%",
				value: 99,
				system_id: seedData.system.id,
			},
			{
				name: "cpu usage",
				time: new Date(startDate.getTime() + 5000), // +5 seconds
				unit: "%",
				value: 99,
				system_id: seedData.system.id,
			},
			{
				name: "cpu usage",
				time: new Date(startDate.getTime() + 6000), // +6 seconds
				unit: "%",
				value: 99,
				system_id: seedData.system.id,
			},
			{
				name: "cpu usage",
				time: new Date(startDate.getTime() + 7000), // +7 seconds
				unit: "%",
				value: 99,
				system_id: seedData.system.id,
			},
			{
				name: "cpu usage",
				time: new Date(startDate.getTime() + 8000), // +8 seconds
				unit: "%",
				value: 99,
				system_id: seedData.system.id,
			},
			{
				name: "cpu usage",
				time: new Date(startDate.getTime() + 9000), // +9 seconds
				unit: "%",
				value: 99,
				system_id: seedData.system.id,
			},
		]);

		// Query the latest value on system id
		const systemHealth = await Queries.systemHealth.selectLatest({
			system_id: seedData.system.id,
		});

		// Expect one value
		expect(systemHealth).toBeArrayOfSize(1);

		// Expect value to be unhealthy
		expect(systemHealth[0].avg).toBeGreaterThan(80);

		// Expect value to be unhealthy
		expect(systemHealth[0].healthy).toBeFalse();
	});
});
