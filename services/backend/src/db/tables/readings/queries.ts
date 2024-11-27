import { and, desc, eq, sql } from "drizzle-orm/sql";
import { readings } from "..";
import type { StrictOmit, StrictPick } from "../../../types/strict";
import { db } from "../../postgres";

const preparedselectUnique = db
	.select()
	.from(readings)
	.where(({ system_id }) => eq(system_id, sql.placeholder("system_id")))
	.prepare("select_readings");

export const readingsQueries = {
	insert: async (values: (typeof readings.$inferInsert)[]) =>
		await db.insert(readings).values(values),
	insertWithSystemId: async (
		values: StrictOmit<typeof readings.$inferInsert, "system_id">[],
		system_id: string,
	) => {
		const newValues = values.map((reading) => ({
			...reading,
			system_id,
		}));

		await db.insert(readings).values(newValues);
	},
	selectAll: async ({
		system_id,
	}: StrictPick<typeof readings.$inferSelect, "system_id">) =>
		await preparedselectUnique.execute({ system_id }),
	selectLatest: async ({
		system_id,
		name,
	}: StrictPick<typeof readings.$inferSelect, ["system_id", "name"]>) => {
		return await db
			.select()
			.from(readings)
			.where(and(eq(readings.system_id, system_id), eq(readings.name, name)))
			.orderBy(desc(readings.time))
			.limit(1)
			.then((v) => v.at(0));
	},
};
