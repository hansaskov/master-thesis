import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { table as users } from "../users/table";

export const table = pgTable("sessions", {
	id: text().primaryKey().notNull(),
	user_id: text()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires_at: timestamp({ mode: "date" }).notNull(),
});
