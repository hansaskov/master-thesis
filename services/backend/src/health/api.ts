import Elysia, { error } from "elysia";
import { healthQueries } from "./query";

export const healthApi = new Elysia().get("/health", async () => {
	try {
		// Check database connection health
		await healthQueries.health();

		return { status: "ok" };
	} catch (e) {
		// Log error for monitoring
		console.error("Health check failed:", e);

		return error(503, {
			status: "error",
		});
	}
});
