import { drizzle } from "drizzle-orm/postgres-js";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

export const db = drizzle(process.env.DATABASE_URL, { casing: "snake_case" });