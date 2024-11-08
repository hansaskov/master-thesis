import { pgTable, primaryKey, real, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { systems } from "..";

export const readings = pgTable(
	"readings",
	{
		time: timestamp({ withTimezone: true, mode: "string" }).notNull(),
		system_id: text()
			.notNull()
			.references(() => systems.id, { onDelete: "cascade" }),
		name: text().notNull(),
		value: real().notNull(),
		unit: text().notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.time, table.system_id, table.name] }),
	}),
);

export const insertReadingsSchema = createInsertSchema(readings, {
	time: t.String({ format: "date-time" }),
	system_id: t.String({ minLength: 1 }),
	name: t.String({ minLength: 1 }),
	unit: t.String({ minLength: 1 }),
});

export const selectReadingsSchema = createSelectSchema(readings);
