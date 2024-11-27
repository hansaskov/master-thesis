import { drizzle } from "drizzle-orm/postgres-js";
import { environment } from "../environment";
import { exit } from "process";
import { systems } from "./tables";
import { exponentialBackoff } from "../expoentialBackoff";

export const db = drizzle(environment.DATABASE_URL, { casing: "snake_case" });

const testDbConnection = () => db.select().from(systems).limit(1).then(v => v.at(0))

exponentialBackoff(testDbConnection).then(isSuccess => {
    if (isSuccess) {
        console.log("✅ Successfully connected to Postgres")
    } else {
        console.log("❗ CRITICAL ERROR: Failed to connect to db")
    }
})