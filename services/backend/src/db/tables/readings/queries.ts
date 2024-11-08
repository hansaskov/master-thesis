import { eq, sql } from "drizzle-orm/sql";
import { readings } from "..";
import type { StrictPick } from "../../../types/strict";
import type { Table } from "../../model";
import { db } from "../../postgres";

const PreparedselectUnique = db
	.select()
	.from(readings)
	.where(({ system_id }) => eq(system_id, sql.placeholder("system_id")))
	.prepare("select_readings");

async function selectAll({ system_id }: StrictPick<typeof Table.readings.$inferSelect, "system_id">) {
	return await PreparedselectUnique.execute({ system_id });
}

export const readingsQueries = {
	selectAll,
};
