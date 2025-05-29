import { exit } from "node:process";
import { systems } from "$collections/systems/table";
import { environment } from "$config/environment";
import { exponentialBackoff } from "$utils/exponentialBackoff";
import { drizzle } from "drizzle-orm/postgres-js";

export const db = drizzle(environment.DATABASE_URL, { casing: "snake_case" });

const testDbConnection = () =>
	db
		.select()
		.from(systems)
		.limit(1)
		.then((v) => v.at(0));

exponentialBackoff(testDbConnection).then((isSuccess) => {
	if (isSuccess) {
		console.log("✅ Successfully connected to Postgres");
	} else {
		console.error("❗ CRITICAL ERROR: Failed to connect to db");
		console.error("😶‍🌫️ Exit code 1");
		exit(1);
	}
});
