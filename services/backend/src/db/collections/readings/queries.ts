import type { Types } from "$types/index";
import { and, desc, eq, sql } from "drizzle-orm/sql";
import type { StrictOmit, StrictPick } from "$types/strict";
import { db } from "$db/postgres";
import { readings } from "./schema";

const preparedselectUnique = db
	.select()
	.from(readings)
	.where(({ system_id }) => eq(system_id, sql.placeholder("system_id")))
	.prepare("select_readings");

export const readingsQueries = {
	insert: async (values: Types.Reading[]) =>
		await db.insert(readings).values(values),
	insertWithSystemId: async (
		values: StrictOmit<Types.Reading, "system_id">[],
		system_id: string,
	) => {
		const newValues = values.map((reading) => ({
			...reading,
			system_id,
		}));

		await db.insert(readings).values(newValues);
	},
	selectAll: async ({ system_id }: StrictPick<Types.Reading, "system_id">) =>
		await preparedselectUnique.execute({ system_id }),
	selectLatest: async ({
		system_id,
		name,
	}: StrictPick<Types.Reading, "system_id" | "name">) => {
		return await db
			.select()
			.from(readings)
			.where(and(eq(readings.system_id, system_id), eq(readings.name, name)))
			.orderBy(desc(readings.time))
			.limit(1)
			.then((v) => v.at(0));
	},
};