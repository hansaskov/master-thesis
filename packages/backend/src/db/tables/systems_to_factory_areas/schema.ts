import { pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";
import { factoryAreas } from "../factory_areas/schema";
import { systems } from "../systems/schema";

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
	(table) => ({
		pk: primaryKey({ columns: [table.system_id, table.factory_area_id] }),
	}),
);
