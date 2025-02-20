import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import process from "node:process";
import { app } from "./server";
import { env } from "elysia";

export type App = typeof app;
export type * as Types from "$collections/types";

const signals = ["SIGINT", "SIGTERM"]

for (const signal of signals) {
	process.on(signal, async () => {
		console.log(`Received ${signal}. Initiating graceful shutdown...`)
		await app.stop()
		process.exit(0)
	})
}

process.on("uncaughtException", error => {
	console.error(error)
})

process.on("unhandledRejection", error => {
	console.error(error)
})

app.listen(env.PORT ?? 3000, () =>
	console.info("🚀 Server started at http://127.0.0.1:3000/")
)