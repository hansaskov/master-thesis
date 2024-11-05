import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

export async function runMigrations({ db }: { db: PostgresJsDatabase }) {
	return migrate(db, { migrationsFolder: "./drizzle"});
}
