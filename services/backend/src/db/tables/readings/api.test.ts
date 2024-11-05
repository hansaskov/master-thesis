import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { Elysia } from "elysia";
import { seedDatabase } from "../../seed";
import { readings } from "./api";

import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { runMigrations } from "../../../migrations";

function createTestDatabase(postgresContainer: StartedPostgreSqlContainer) {
	const postgresClient = postgres({
		host: postgresContainer.getHost(),
		port: postgresContainer.getPort(),
		database: postgresContainer.getDatabase(),
		user: postgresContainer.getUsername(),
		password: postgresContainer.getPassword(),
	});

	const db = drizzle(postgresClient);

	return db;
}

function createTestApi({ db }: { db: PostgresJsDatabase }) {
	const app = new Elysia().use(readings({ db: db }));
	const api = treaty(app);

	return api;
}

describe("Reading Endpoint", async () => {
	let postgresContainer: StartedPostgreSqlContainer;
	let db: PostgresJsDatabase;
	let api: Awaited<ReturnType<typeof createTestApi>>
	let seedData: Awaited<ReturnType<typeof seedDatabase>>;

	// Set up test data before running tests
	beforeAll(async () => {
		console.log("Setting up test data...");
		postgresContainer = await new PostgreSqlContainer().start();
		console.log("Starting database...");
		db = createTestDatabase(postgresContainer);
		api = createTestApi({db});

		// Create database migration
		await runMigrations({db});

		// Seed database
		seedData = await seedDatabase({db})
	});

	afterAll(async () => {
		await postgresContainer.stop();
	});

	it("valid credentials", async () => {
		const testReadings = [
			{
				time: new Date().toISOString(),
				name: "temperature",
				value: 25.5,
				unit: "celsius",
			},
			{
				time: new Date().toISOString(),
				name: "humidity",
				value: 60,
				unit: "percent",
			},
		];

		const { status, error } = await api.reading.post(testReadings, {
			headers: {
				public_key: seedData.key.public_key,
				private_key: seedData.key.private_key,
			},
		});

		expect(status).toBe(200);
		expect(error).toBeNull();
	});

	it("invalid credentials", async () => {
		const testReadings = [
			{
				time: new Date().toISOString(),
				name: "temperature",
				value: 25.5,
				unit: "celsius",
			},
		];

		const { status, error } = await api.reading.post(testReadings, {
			headers: {
				public_key: "invalid-public-key",
				private_key: "invalid-private-key",
			},
		});

		expect(status).toBe(401);
		expect(error?.value).toBe("The provided key does not exists");
	});

	it("invalid data", async () => {
		const invalidReading = [
			{
				time: "invalid-date", // Invalid date format
				name: "temperature",
				value: "not-a-number", // Invalid value type
				unit: "celsius",
			},
		];

		const { status, error } = await api.reading.post(
			// @ts-ignore - Intentionally testing with invalid types
			invalidReading,
			{
				headers: {
					public_key: seedData.key.public_key,
					private_key: seedData.key.private_key,
				},
			},
		);

		expect(status).toBe(422);
		expect(error).toBeDefined();
	});

	it("empty data", async () => {
		const { status, error } = await api.reading.post([], {
			headers: {
				public_key: seedData.key.public_key,
				private_key: seedData.key.private_key,
			},
		});

		expect(status).toBe(422);
		expect(error).toBeDefined();
	});

	it("multiple readings in a single request", async () => {
		const manyReadings = Array.from({ length: 100 }, (_, i) => ({
			time: new Date().toISOString(),
			name: `sensor${i}`,
			value: Math.random() * 100,
			unit: "units",
		}));

		const { status, error } = await api.reading.post(manyReadings, {
			headers: {
				public_key: seedData.key.public_key,
				private_key: seedData.key.private_key,
			},
		});

		expect(status).toBe(200);
		expect(error).toBeNull();
	});
});
