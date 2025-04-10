import { availableParallelism } from "node:os";
import process from "node:process";
import { env } from "elysia";
// import { app } from "./server";
import { spawn } from "bun";
import cluster from "node:cluster";

// export type App = typeof app;
export type * as Types from "$collections/types";

// Only run clustering logic in the main process
if (cluster.isPrimary) {
  const numCPUs = 1;
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