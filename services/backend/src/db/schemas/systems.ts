import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { organizations } from "./organizations";
import { systemModels } from "./system_models";

export const systems = pgTable("systems", {
	id: uuid().primaryKey().notNull().$default(uuidv7),
	name: text().notNull(),
	organization_id: uuid()
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
	system_model_id: uuid().references(() => systemModels.id, { onDelete: "set null" }),
});
