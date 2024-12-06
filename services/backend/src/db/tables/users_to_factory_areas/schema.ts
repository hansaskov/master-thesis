import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { factoryAreas, users } from "..";
import type { PartialExcept } from "../../../types/strict";

export const usersToFactoryAreas = pgTable(
	"users_to_factory_areas",
	{
		user_id: text()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		factory_area_id: text()
			.notNull()
			.references(() => factoryAreas.id, { onDelete: "cascade" }),
	},
	(table) => [primaryKey({ columns: [table.user_id, table.factory_area_id] })],
);

export type UserToFactoryArea = typeof usersToFactoryAreas.$inferSelect;
export type UserToFactoryAreaNew = typeof usersToFactoryAreas.$inferInsert;
export type UserToFactoryAreaUpdate = PartialExcept<
	UserToFactoryArea,
	"user_id" | "factory_area_id"
>;
