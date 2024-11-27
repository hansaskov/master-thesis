import { drizzle } from "drizzle-orm/postgres-js";
import { environment } from "../environment";
import { exit } from "process";
import { systems } from "./tables";

export const db = drizzle(environment.DATABASE_URL, { casing: "snake_case" });

const testDbConnection = async () => {
    try {
        console.log("INFO: Testing db connection to systems table");

        // Await the database query
        await db.select({ id: systems.id }).from(systems).limit(1);

        console.log("INFO: Testing succeeded, continuing");

    } catch (e) {
        console.error(e)
        console.error("CRITICAL ERROR: Cannot access systems table. Shutting down");
        exit(1)
    }
};

// Invoke the testDbConnection function on startup
testDbConnection();
