import type { PartialOmit, StrictPick } from "$types/strict";
import type { table } from "./table";

export type Select = typeof table.$inferSelect;
export type Insert = typeof table.$inferInsert;
export type Update = PartialOmit<Select, "organization_id" | "user_id">;
export type Unique = StrictPick<Select, "organization_id" | "user_id">;
export type Role = StrictPick<Select, "role">;
