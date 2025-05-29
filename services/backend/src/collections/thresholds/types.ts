import type { PartialOmit, StrictPick } from "$types/strict";
import type { table } from "./table";

export type Select = typeof table.$inferSelect;
export type Insert = typeof table.$inferInsert;
export type Update = PartialOmit<
	Select,
	"system_id" | "category" | "name" | "unit"
>;
export type Unique = StrictPick<
	Select,
	"system_id" | "category" | "name" | "unit"
>;
