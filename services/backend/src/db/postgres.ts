import { drizzle } from "drizzle-orm/postgres-js";
import { enviroment } from "../enviroment";

export const db = drizzle(enviroment.DATABASE_URL, { casing: "snake_case" });
