import {
	type SystemHealthWithStatus,
	system_health,
} from "$collections/system_health/schema";
import { db } from "$db/postgres";
import type { Types } from "$types/collection";
import type { StrictPick } from "$types/strict";
import { desc, eq, sql } from "drizzle-orm";
import { systems } from "./schema";

export type SystemHealthSimple = StrictPick<
	SystemHealthWithStatus,
	"system_id" | "category" | "name" | "unit" | "healthy" | "running"
>;

export const systemQueries = {
	create: async (values: Types.SystemNew) =>
		await db
			.insert(systems)
			.values(values)
			.returning()
			.then((v) => v[0]),
	selectAll: async () => await db.select().from(systems),
	selectAllOnOrgId: async (organization: StrictPick<Types.System, "id">) =>
		await db
			.select()
			.from(systems)
			.where(eq(systems.organization_id, organization.id)),
	selectSystemsWithHealth: (organization: StrictPick<Types.System, "id">) => {
		const subquery = db
			.selectDistinctOn(
				[
					system_health.system_id,
					system_health.category,
					system_health.name,
					system_health.unit,
				],
				{
					system_id: system_health.system_id,
					category: system_health.category,
					name: system_health.name,
					unit: system_health.unit,
					healthy: system_health.healthy,
					bucket: system_health.bucket,
				},
			)
			.from(system_health)
			.orderBy(
				system_health.system_id,
				system_health.category,
				system_health.name,
				system_health.unit,
				desc(system_health.bucket),
			)
			.as("sh");

		// Main query
		return db
			.select({
				// Include all systems columns
				id: systems.id,
				name: systems.name,
				organization_id: systems.organization_id,
				system_model: systems.system_model,
				// Add the JSON aggregation
				latest_readings: sql<SystemHealthSimple[] | null>`json_agg(
					  json_build_object(
						'system_id', ${subquery.system_id},
						'category', ${subquery.category},
						'name', ${subquery.name},
						'unit', ${subquery.unit},
						'healthy', ${subquery.healthy},
						'running', ${subquery.bucket} > localtimestamp - INTERVAL '5 minutes'
					  )
					) FILTER (WHERE ${subquery.system_id} IS NOT NULL)`.as(
					"latest_readings",
				),
			})
			.from(systems)
			.leftJoin(subquery, eq(systems.id, subquery.system_id))
			.where(eq(systems.organization_id, organization.id))
			.groupBy(
				systems.id,
				systems.name,
				systems.organization_id,
				systems.system_model,
			);
	},
	delete: async ({ id }: StrictPick<Types.System, "id">) =>
		await db
			.delete(systems)
			.where(eq(systems.id, id))
			.returning()
			.then((v) => v.at(0)),
	update: async (values: Types.SystemUpdate) =>
		await db
			.update(systems)
			.set(values)
			.where(eq(systems.id, values.id))
			.returning()
			.then((v) => v.at(0)),
};
