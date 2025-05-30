import Elysia, { error } from "elysia";
import { healthQueries } from "./query";

export const healthApi = new Elysia().get("/health", async () => {
	try {
		const start = Date.now();
		await healthQueries.health();
		const duration = (Date.now() - start) / 1000;

		if (duration > 1) return error(504, { status: "timed out", duration });

		return { status: "ok", duration };
	} catch (e) {
		console.error("Health check failed:", e);
		return error(503, { status: "error" });
	}
});
