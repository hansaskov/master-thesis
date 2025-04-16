import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import process from "node:process";
import { environment } from "$config/environment";
import { spawn } from "bun";
import { env } from "elysia";
import type { app } from "./server";

export type App = typeof app;
export type * as Types from "$collections/types";

// Only run clustering logic in the main process
if (cluster.isPrimary) {
	const numCPUs = environment.NUM_CLUSTER;
	console.log(`🔄 Starting ${numCPUs} workers...`);

	const workers = new Array(numCPUs);

	// Spawn worker processes
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	// Handle graceful shutdown for the main process
	cluster.on("exit", (worker) => {
		console.log(`worker ${worker.process.pid} died`);
		process.exit(1);
	});
} else {
	await import("./server");
	console.log(`Worker with id ${process.pid} started`);
}
