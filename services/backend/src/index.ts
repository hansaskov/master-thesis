import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import process from "node:process";
import { app } from "./server";

export type App = typeof app;
export type * as Types from "$collections/types";

if (cluster.isPrimary) {
	console.log(`Primary ${process.pid} is running`);

	// Start N workers for the number of CPUs
	const numberOfThreads = 1;
	for (let i = 0; i < numberOfThreads; i++) {
		cluster.fork();
	}

	cluster.on("exit", (worker) => {
		console.log(`worker ${worker.process.pid} died`);
		process.exit(1);
	});
} else {
	app.listen(process.env.PORT as string);
	console.log(`🦊 Worker ${process.pid} started at ${app.server?.url.origin}`);
}
