import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./postgres";

export async function runMigrations() {
	return migrate(db, { migrationsFolder: "./drizzle" });
}
