import { db } from "$db/postgres";
import { and, between, eq, sql } from "drizzle-orm/sql";
import { table } from "./table";

export async function select({
	system_id,
	start,
	end,
	limit,
}: {
	system_id: string;
	start: Date;
	end: Date;
	limit?: number;
}) {
	return await db
		.select({
			time: table.bucket,
			system_id: table.system_id,
			name: table.name,
			value: table.avg,
			unit: table.unit,
			category: table.category,
		})
		.from(table)
		.where(
			and(
				eq(table.system_id, system_id),
				between(
					table.bucket,
					sql`${start.toISOString()}::timestamp with time zone`,
					sql`${end.toISOString()}::timestamp with time zone`,
				),
			),
		)
		.limit(limit ?? 1000);
}
