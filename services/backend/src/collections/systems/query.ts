import type { Insert, Select, Unique, Update } from "./types";
import { eq, and, sql, desc } from "drizzle-orm";
import { db } from "$db/postgres";
import { table } from "./table";
import { Organization } from "$collections/organizations";

// ------ SELECT --------

export async function selectAll() {
	return await db.select().from(table);
}

export async function selectFirst() {
	return await db
		.select()
		.from(table)
		.limit(1)
		.then((v) => v.at(0));
}

export async function selectUnique(id: string) {
	return await db
		.select()
		.from(table)
		.where(eq(table.id, id))
		.limit(1)
		.then((v) => v.at(0));
}

// ------ INSERT --------

export async function insertOne(values: Insert) {
	return await db
		.insert(table)
		.values(values)
		.returning()
		.then((v) => v[0]);
}

export async function insertMany(values: Insert[]) {
	return await db.insert(table).values(values).returning();
}

// ------ UPDATE --------

export async function update(values: Update) {
	return await db
		.update(table)
		.set(values)
		.where(eq(table.id, values.id))
		.returning()
		.then((v) => v.at(0));
}

// ------ DELETE --------

export async function remove({ id }: Unique) {
	return await db
		.delete(table)
		.where(eq(table.id, id))
		.returning()
		.then((v) => v.at(0));
}

// ------ OTHERS --------
import { table as system_health, SystemHealh } from "../system_health";
import { StrictPick } from "$types/strict";

export type SystemHealthSimple = StrictPick<
	SystemHealh.WithStatus,
	"system_id" | "category" | "name" | "unit" | "healthy" | "running" | "bucket"
>;

export async function selectAllOnOrgId(organization: StrictPick<Select, "id">) {
	return await db
		.select()
		.from(table)
		.where(eq(table.organization_id, organization.id));
}

export async function selectAllWithHealth(
	organization?: StrictPick<Select, "id">,
) {
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
	return await db
		.select({
			// Include all systems columns
			id: table.id,
			name: table.name,
			organization_id: table.organization_id,
			system_model: table.system_model,
			// Add the JSON aggregation
			latest_readings: sql<SystemHealthSimple[] | null>`json_agg(
					  json_build_object(
						'system_id', ${subquery.system_id},
						'category', ${subquery.category},
						'name', ${subquery.name},
						'unit', ${subquery.unit},
						'bucket', ${subquery.bucket},
						'healthy', ${subquery.healthy},
						'running', ${subquery.bucket} > localtimestamp - INTERVAL '5 minutes'
					  )
					) FILTER (WHERE ${subquery.system_id} IS NOT NULL)`.as(
				"latest_readings",
			),
		})
		.from(table)
		.leftJoin(subquery, eq(table.id, subquery.system_id))
		.where(
			organization ? eq(table.organization_id, organization.id) : undefined,
		)
		.groupBy(table.id, table.name, table.organization_id, table.system_model);
}
