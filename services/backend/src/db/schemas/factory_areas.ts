import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { generateRandomString, organizations } from "./";

export const factoryAreas = pgTable("factory_areas", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(12)),
	name: text().notNull(),
	organization_id: text()
		.notNull()
		.references(() => organizations.id, { onDelete: "cascade" }),
});
