import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { parts, systemModels } from "..";
import { PartialExcept } from "../../../types/strict";

export const partsToSystemModels = pgTable(
	"parts_to_system_models",
	{
		part_id: text()
			.notNull()
			.references(() => parts.id, { onDelete: "cascade" }),
		system_model_id: text()
			.notNull()
			.references(() => systemModels.id, { onDelete: "cascade" }),
	},
	(table) => [primaryKey({ columns: [table.part_id, table.system_model_id] })],
);


export type PartToSystemModel = typeof partsToSystemModels.$inferSelect;
export type PartToSystemModelNew = typeof partsToSystemModels.$inferInsert;
export type PartToSystemModelUpdate = PartToSystemModel

