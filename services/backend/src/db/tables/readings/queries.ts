import { eq, sql } from "drizzle-orm/sql";
import { readings } from "..";
import type { StrictOmit, StrictPick } from "../../../types/strict";
import { db } from "../../postgres";

async function insert(values: (typeof readings.$inferInsert)[]) {
	return await db.insert(readings).values(values);
}

async function insertWithSystemId(values: StrictOmit<typeof readings.$inferInsert, "system_id">[], system_id: string) {
	const newValues = values.map((reading) => ({
		...reading,
		system_id,
	}));

	await db.insert(readings).values(newValues);
}

const preparedselectUnique = db
	.select()
	.from(readings)
	.where(({ system_id }) => eq(system_id, sql.placeholder("system_id")))
	.prepare("select_readings");

async function selectAll({ system_id }: StrictPick<typeof readings.$inferSelect, "system_id">) {
	return await preparedselectUnique.execute({ system_id });
}

export const readingsQueries = {
	insert,
	insertWithSystemId,
	selectAll,
};
