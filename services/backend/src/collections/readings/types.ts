import type { PartialOmit, StrictPick } from "$types/strict";
import type { table } from "./table";

export type Select = typeof table.$inferSelect;
export type Insert = typeof table.$inferInsert;
export type Update = PartialOmit<Select, "time" | "system_id" | "name">;
export type Unique = StrictPick<
	Select,
	"system_id" | "category" | "unit" | "name" | "time"
>;
