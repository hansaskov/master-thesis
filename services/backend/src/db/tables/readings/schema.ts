import { pgTable, primaryKey, real, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";
import { systems } from "..";

export const readings = pgTable(
	"readings",
	{
		time: timestamp({ withTimezone: true, mode: "string" }).notNull(),
		systems_id: text()
			.notNull()
			.references(() => systems.id, { onDelete: "cascade" }),
		name: text().notNull(),
		value: real().notNull(),
		unit: text().notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.time, table.systems_id, table.name] }),
	}),
);

export const insertReadingsSchema = createInsertSchema(readings, {
	time: t.String({ format: "date" }),
	systems_id: t.String({ minLength: 1 }),
	name: t.String({ minLength: 1 }),

	unit: t.String({ minLength: 1 }),
});
