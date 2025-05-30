import { beforeAll, describe, expect, it } from "bun:test";
import { treaty } from "@elysiajs/eden";
import Elysia from "elysia";
import { healthApi } from "./api";

describe("health", () => {
	const app = new Elysia().use(healthApi);
	const api = treaty(app);

	it("should return 200 for /health", async () => {
		const response = await api.health.get();
		expect(response.status).toBe(200);
	});
});
