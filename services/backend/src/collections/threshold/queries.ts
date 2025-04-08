import { readings } from "$collections/readings/schema";
import { db } from "$db/postgres";
import type { Types } from "$types/collection";
import type { StrictPick } from "$types/strict";
import {
	and,
	asc,
	between,
	desc,
	eq,
	gt,
	isNull,
	lt,
	not,
	sql,
} from "drizzle-orm/sql";
import { type ThresholdNew, type ThresholdUnique, threshold } from "./schema";

export const thresholdQueries = {
	insert: (values: ThresholdNew) =>
		db
			.insert(threshold)
			.values(values)
			.returning()
			.then((v) => v[0]),

	insertMany: (values: ThresholdNew[]) =>
		db.insert(threshold).values(values).returning(),

	select: ({ system_id }: StrictPick<Types.Reading, "system_id">) =>
		db.select().from(threshold).where(eq(threshold.system_id, system_id)),

	toggle: (values: ThresholdUnique) =>
		db
			.update(threshold)
			.set({
				enabled: not(threshold.enabled),
			})
			.where(
				and(
					eq(threshold.system_id, values.system_id),
					eq(threshold.category, values.system_id),
					eq(threshold.name, values.name),
					eq(threshold.unit, values.unit),
				),
			),
	selectAllUniqueWithoutThreshold: async ({
		system_id,
	}: StrictPick<Types.Reading, "system_id">) => {
		return await db
			.selectDistinctOn(
				[readings.system_id, readings.category, readings.unit, readings.name],
				{
					system_id: readings.system_id,
					category: readings.category,
					unit: readings.unit,
					name: readings.name,
				},
			)
			.from(readings)
			.leftJoin(
				threshold,
				and(
					eq(readings.system_id, threshold.system_id),
					eq(readings.category, threshold.category),
					eq(readings.unit, threshold.unit),
					eq(readings.name, threshold.name),
				),
			)
			.where(
				and(eq(readings.system_id, system_id), isNull(threshold.system_id)),
			)
			.orderBy(
				readings.system_id,
				readings.category,
				readings.unit,
				readings.name,
			);
	},
};
