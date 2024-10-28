import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { generateRandomString } from ".";
import { organizations } from "./organizations";
import { systemModels } from "./system_models";

export const systems = pgTable("systems", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(12)),
	name: text().notNull(),
	organization_id: text()
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	system_model_id: text().references(() => systemModels.id, { onDelete: "set null" }),
});
