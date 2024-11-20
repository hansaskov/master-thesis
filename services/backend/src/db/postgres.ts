import { drizzle } from "drizzle-orm/postgres-js";
import { environment } from "../environment";

export const db = drizzle(environment.DATABASE_URL, { casing: "snake_case" });
