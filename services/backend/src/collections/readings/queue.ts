import { Queries } from "$collections/queries";
import type { Types } from "$types/collection";

// Top-level array to store readings before bulk insert
const pendingReadings: Array<Types.ReadingNew> = [];

function push(...items: Types.ReadingNew[]) {
	pendingReadings.push(...items);
}

// Function to insert all pending readings
const insertPendingReadings = async () => {
	if (pendingReadings.length === 0) return;

	// Extract all current readings and clear the array atomically
	const readingsToInsert = pendingReadings.splice(0);

	try {
		await Queries.readings.insertUnnest(readingsToInsert);
		console.log(`Bulk inserted ${readingsToInsert.length} readings`);
	} catch (error) {
		console.error("Failed to bulk insert readings:", error);
		// Re-add failed readings back to the queue (optional)
		pendingReadings.unshift(...readingsToInsert);
	}
};

// Background task to bulk insert readings every 1.5 seconds
const startBulkInsertTask = () => {
	setInterval(insertPendingReadings, 1500); // 1.5 seconds
};

// Graceful shutdown handler to insert remaining readings
const setupGracefulShutdown = () => {
	const handleShutdown = async (signal: string) => {
		console.log(
			`Received ${signal}, inserting pending readings before shutdown...`,
		);
		await insertPendingReadings();
		console.log("Graceful shutdown complete");
		process.exit(0);
	};

	process.on("SIGTERM", () => handleShutdown("SIGTERM"));
	process.on("SIGINT", () => handleShutdown("SIGINT"));
	process.on("SIGUSR2", () => handleShutdown("SIGUSR2")); // nodemon restart
};

// Start the background task and setup graceful shutdown
startBulkInsertTask();
setupGracefulShutdown();

export default { push };
