import { table as readings } from "$collections/readings/table";
import { table as threshold } from "$collections/thresholds/table";
import { TsIntervalTimeBucket, avg, last } from "$db/drizzle/customTypes";
import { and, eq, lt } from "drizzle-orm";
import { pgMaterializedView } from "drizzle-orm/pg-core";
import type { Prettify } from "elysia/types";

export const table = pgMaterializedView("system_health")
	.withNoData()
	.as((qb) => {
		return qb
			.select({
				bucket: TsIntervalTimeBucket("5 minutes", readings.time).as("bucket"),
				system_id: readings.system_id,
				category: readings.category,
				unit: readings.unit,
				name: readings.name,
				avg: avg(readings.value).as("average_reading"),
				last: last(threshold.threshold, readings.time).as("threshold"),
				healthy: lt(
					avg(readings.value),
					last(threshold.threshold, readings.time),
				)
					.mapWith(Boolean)
					.as("healthy"),
			})
			.from(readings)
			.innerJoin(
				threshold,
				and(
					eq(readings.system_id, threshold.system_id),
					eq(readings.category, threshold.category),
					eq(readings.unit, threshold.unit),
					eq(readings.name, threshold.name),
				),
			)
			.where(eq(threshold.enabled, true))
			.groupBy(({ system_id, category, unit, name, bucket }) => [
				system_id,
				category,
				unit,
				name,
				bucket,
			]);
	});
