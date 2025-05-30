import { db } from "$db/postgres";
import type { StrictPick } from "$types/strict";
import { desc, eq, inArray } from "drizzle-orm/sql";
import { table } from "./table";
import { Reading } from "$collections/readings";

export async function select({
	system_id,
}: StrictPick<Reading.Insert, "system_id">) {
	return await db.select().from(table).where(eq(table.system_id, system_id));
}

export async function selectLatest(system_ids: Reading.Insert["system_id"][]) {
	return await db
		.selectDistinctOn([table.system_id, table.category, table.name, table.unit])
		.from(table)
		.where(inArray(table.system_id, system_ids))
		.orderBy(
			table.system_id,
			table.category,
			table.name,
			table.unit,
			desc(table.bucket),
		);
}
