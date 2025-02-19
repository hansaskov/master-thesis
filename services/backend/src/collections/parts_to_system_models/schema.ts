import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { parts } from "../parts/schema";
import { systemModels } from "../system_models/schema";
import { t } from "elysia";
import { createInsertSchema } from "drizzle-typebox";

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

export const insertPartsToSystemModelsSchema = createInsertSchema(partsToSystemModels);

export type PartToSystemModel = typeof partsToSystemModels.$inferSelect;
export type PartToSystemModelNew = typeof partsToSystemModels.$inferInsert;
export type PartToSystemModelUpdate = PartToSystemModel;
