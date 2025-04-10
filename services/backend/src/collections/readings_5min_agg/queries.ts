import { db } from "$db/postgres";
import type { Types } from "$types/collection";
import type { StrictOmit, StrictPick } from "$types/strict";
import { and, asc, between, desc, eq, gt, lt, sql } from "drizzle-orm/sql";
import { readings_5min_agg } from "./schema";

export const readings5minAggQueries = {
	select: async ({
		system_id,
		start,
		end,
		limit,
	}: {
		system_id: string;
		start: Date;
		end: Date;
		limit?: number;
	}) =>
		await db
			.select({
				time: readings_5min_agg.bucket,
				system_id: readings_5min_agg.system_id,
				name: readings_5min_agg.name,
				value: readings_5min_agg.avg,
				unit: readings_5min_agg.unit,
				category: readings_5min_agg.category,
			})
			.from(readings_5min_agg)
			.where(
				and(
					eq(readings_5min_agg.system_id, system_id),
					between(
						readings_5min_agg.bucket,
						sql`${start.toISOString()}::timestamp with time zone`,
						sql`${end.toISOString()}::timestamp with time zone`,
					),
				),
			)
			.limit(limit ?? 1000),
};
