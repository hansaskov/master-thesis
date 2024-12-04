import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";
import { systemModels } from "..";
import { generateRandomString } from "../../utils";
import { organizations } from "../organizations/schema";

export const systems = pgTable("systems", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(12)),
	name: text().notNull(),
	organization_id: text()
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	system_model_id: text().references(() => systemModels.id, {
		onDelete: "set null",
	}),
});

export const insertSystemsSchema = createInsertSchema(systems, {
	id: t.String({ minLength: 12 }),
	name: t.String({ minLength: 1 }),
	organization_id: t.String({ minLength: 1 }),
	system_model_id: t.String({ minLength: 1 }),
});

export namespace Types {
	export namespace Systems {
		export type Select = typeof systems.$inferSelect;
		export type New = typeof systems.$inferInsert;
	}
}
