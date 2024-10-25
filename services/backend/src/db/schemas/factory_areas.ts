import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { organizations } from "./";

export const factoryAreas = pgTable("factory_areas", {
	id: uuid().primaryKey().notNull().$default(uuidv7),
	name: text().notNull(),
	organization_id: uuid()
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
});
