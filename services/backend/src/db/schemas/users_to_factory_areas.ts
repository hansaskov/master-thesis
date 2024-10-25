import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { factoryAreas, users } from "./";

export const usersToFactoryAreas = pgTable(
	"users_to_factory_areas",
	{
		user_id: uuid()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		factory_area_id: uuid()
			.notNull()
			.references(() => factoryAreas.id, { onDelete: "cascade" }),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.user_id, table.factory_area_id] }),
	}),
);
