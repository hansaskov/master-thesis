import Elysia, { error } from "elysia";
import { healthQueries } from "./query";

export const healthApi = new Elysia().get("/health", async () => {
	try {
		const start = Date.now();

		// Check database connection health
		await healthQueries.health();

		const duration = (Date.now() - start) / 1000;
		const isLong = duration > 1.0;

		if (isLong) {
			return error("Gateway Timeout", {
				status: "timed out",
				duration,
			});
		}

		return {
			status: "ok",
			duration,
		};
	} catch (e) {
		// Log error for monitoring
		console.error("Health check failed:", e);

		return error(503, {
			status: "error",
		});
	}
});
