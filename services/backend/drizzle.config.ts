import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
	throw Error("No Database url found in environment");
}

export default defineConfig({
	out: "./src/db/migrations",
	schema: "./src/collections/**/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
});
