import { pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";
import { factoryAreas } from "../factory_areas/schema";
import { systems } from "../systems/schema";
import { PartialExcept } from "../../../types/strict";

export const systemsToFactoryAreas = pgTable(
	"systems_to_factory_areas",
	{
		system_id: text()
			.notNull()
			.references(() => systems.id, { onDelete: "cascade" }),
		factory_area_id: text()
			.notNull()
			.references(() => factoryAreas.id, { onDelete: "cascade" }),
	},
	(table) => [primaryKey({ columns: [table.system_id, table.factory_area_id] })],
);

export type SystemToFactoryArea = typeof systemsToFactoryAreas.$inferSelect;
export type SystemToFactoryAreaNew = typeof systemsToFactoryAreas.$inferInsert;
export type SystemToFactoryAreaUpdate = PartialExcept<SystemToFactoryArea, "system_id" | "factory_area_id">

