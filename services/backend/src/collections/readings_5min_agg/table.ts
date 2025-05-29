import { table as readings } from "$collections/readings/table";
import {
	TsTimeBucket,
	avg,
	first,
	last,
	max,
	min,
} from "$db/drizzle/customTypes";
import { count } from "drizzle-orm";
import { pgMaterializedView } from "drizzle-orm/pg-core";

export const table = pgMaterializedView("readings_5min_agg")
	.withNoData()
	.as((qb) => {
		return qb
			.select({
				bucket: TsTimeBucket("5 minutes", readings.time).as("bucket"),
				name: readings.name,
				unit: readings.unit,
				category: readings.category,
				system_id: readings.system_id,
				avg: avg(readings.value).as("avg"),
				min: min(readings.value).as("min"),
				max: max(readings.value).as("max"),
				count: count().as("count"),
				first: first(readings.time).as("first"),
				last: last(readings.time).as("last"),
			})
			.from(readings)
			.groupBy(({ system_id, category, unit, name, bucket }) => [
				system_id,
				category,
				unit,
				name,
				bucket,
			]);
	});
