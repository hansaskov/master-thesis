import { db } from "$db/postgres";
import type { Types } from "$types/collection";
import type { StrictPick } from "$types/strict";
import { desc, eq, inArray } from "drizzle-orm/sql";
import { system_health } from "./schema";

export const SystemHealthQueries = {
	select: ({ system_id }: StrictPick<Types.Reading, "system_id">) =>
		db
			.select()
			.from(system_health)
			.where(eq(system_health.system_id, system_id)),
	selectLatest: (system_ids: Types.Reading["system_id"][]) =>
		db
			.selectDistinctOn([
				system_health.system_id,
				system_health.category,
				system_health.name,
				system_health.unit,
			])
			.from(system_health)
			.where(inArray(system_health.system_id, system_ids))
			.orderBy(
				system_health.system_id,
				system_health.category,
				system_health.name,
				system_health.unit,
				desc(system_health.bucket),
			),
};
