import { beforeAll, describe, expect, it } from "bun:test";
import { db } from "$db/postgres";
import { sql } from "drizzle-orm";
import { c } from "..";
import { Readings5minAgg } from ".";

async function seedDatabase(startDate: Date) {
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

	// Insert key
	const key = await c.keys.insertOne({
		system_id: system.id,
		name: "Test key 1",
	});

	// Insert readings.
	const readings = await c.readings.insertMany([
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

	return { organization, system, key, readings };
}

describe("5 minutes agg readings", async () => {
	let seedData: Awaited<ReturnType<typeof seedDatabase>>;
	const startDate = new Date(1999, 9, 27); // October is month 9 (0-indexed)
	const endDate = new Date(startDate.getTime() + 3000);

	beforeAll(async () => {
		seedData = await seedDatabase(startDate);
		// Refresh policy to ensure we have the latest aggregated data
		await db.execute(
			sql`CALL refresh_continuous_aggregate('"public"."readings_5min_agg"', NULL, NULL)`,
		);
	});

	it("Check if continues aggregate works", async () => {
		const firstSeedReading = seedData.readings[0];

		// Expected result
		const expectedReading: Readings5minAgg.Select = {
			bucket: startDate,
			first: startDate,
			last: endDate,
			avg:
				seedData.readings.reduce((acc, v) => acc + v.value, 0) /
				seedData.readings.length,
			max: seedData.readings.reduce(
				(acc, v) => Math.max(acc, v.value),
				Number.NEGATIVE_INFINITY,
			),
			min: seedData.readings.reduce(
				(acc, v) => Math.min(acc, v.value),
				Number.POSITIVE_INFINITY,
			),
			count: seedData.readings.length,
			...firstSeedReading,
		};

		// Query data
		const data = await c.readings5minAgg.select({
			start: startDate,
			end: endDate,
			system_id: seedData.system.id,
			limit: 1,
		});

		const reading = data[0];

		// General data fields
		expect(expectedReading.name).toEqual(reading.name);
		expect(expectedReading.unit).toEqual(reading.unit);
		expect(expectedReading.category).toEqual(reading.category);
		expect(expectedReading.system_id).toEqual(reading.system_id);

		// Range
		expect(expectedReading.bucket).toEqual(reading.time);

		// Value
		expect(expectedReading.avg).toEqual(reading.value);

		// Check range
		expect(data).toHaveLength(1);
	});

	it("should return empty array when querying before start date", async () => {
		const beforeStartDate1 = new Date(startDate.getTime() - 200000);
		const beforeStartDate2 = new Date(startDate.getTime() - 300000);

		const data = await c.readings5minAgg.select({
			start: beforeStartDate1,
			end: beforeStartDate2,
			system_id: seedData.system.id,
		});

		expect(data).toHaveLength(0);
	});

	it("should return empty array when querying after end date", async () => {
		const afterEndDate1 = new Date(endDate.getTime() + 100000);
		const afterEndDate2 = new Date(endDate.getTime() + 200000);

		const data = await c.readings5minAgg.select({
			start: afterEndDate1,
			end: afterEndDate2,
			system_id: seedData.system.id,
		});

		expect(data).toHaveLength(0);
	});

	it("should only return data from 10 minutes after first seeded data", async () => {
		// Create readings 10 minutes after the original seeded data
		const tenMinutesLater = new Date(startDate.getTime() + 10 * 60 * 1000); // 10 minutes later

		// Insert new readings
		const laterReadings = await c.readings.insertMany([
			{
				name: "cpu usage",
				time: new Date(tenMinutesLater.getTime() + 1000), // +1 second
				unit: "%",
				value: 40,
				system_id: seedData.system.id,
			},
			{
				name: "cpu usage",
				time: new Date(tenMinutesLater.getTime() + 2000), // +2 seconds
				unit: "%",
				value: 50,
				system_id: seedData.system.id,
			},
			{
				name: "cpu usage",
				time: new Date(tenMinutesLater.getTime() + 3000), // +3 seconds
				unit: "%",
				value: 60,
				system_id: seedData.system.id,
			},
		]);

		// Define query range
		const laterStartDate = tenMinutesLater;
		const laterEndDate = new Date(tenMinutesLater.getTime() + 3000);

		// Refresh the continuous aggregate to ensure we have the latest data
		await db.execute(
			sql`CALL refresh_continuous_aggregate('"public"."readings_5min_agg"', NULL, NULL)`,
		);

		// Expected result for the new readings
		const expectedReading: Readings5minAgg.Select = {
			bucket: laterStartDate,
			first: laterStartDate,
			last: laterEndDate,
			avg:
				laterReadings.reduce((acc, v) => acc + v.value, 0) /
				laterReadings.length,
			max: laterReadings.reduce(
				(acc, v) => Math.max(acc, v.value),
				Number.NEGATIVE_INFINITY,
			),
			min: laterReadings.reduce(
				(acc, v) => Math.min(acc, v.value),
				Number.POSITIVE_INFINITY,
			),
			count: laterReadings.length,
			...laterReadings[0],
		};

		// Query only the new data
		const data = await c.readings5minAgg.select({
			start: laterStartDate,
			end: laterEndDate,
			system_id: seedData.system.id,
			limit: 1,
		});

		// Assertions
		expect(data).toHaveLength(1);

		const reading = data[0];

		// General data fields
		expect(expectedReading.name).toEqual(reading.name);
		expect(expectedReading.unit).toEqual(reading.unit);
		expect(expectedReading.category).toEqual(reading.category);
		expect(expectedReading.system_id).toEqual(reading.system_id);

		// Range
		expect(expectedReading.bucket).toEqual(reading.time);

		// Value
		expect(expectedReading.avg).toEqual(reading.value);

		// Ensure we don't get the original seeded data
		expect(reading.value).not.toEqual(20); // Not equal to average of original data
	});
});
