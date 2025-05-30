import type { Insert, Select, Unique, Update } from "./types";
import { eq, and, sql, desc, not, isNull } from "drizzle-orm";
import { db } from "$db/postgres";
import { table } from "./table";
import { System } from "$collections/systems";
import { StrictPick } from "$types/strict";

// ------ SELECT --------

export async function selectFirst() {
	return await db
		.select()
		.from(table)
		.limit(1)
		.then((v) => v.at(0));
}

export async function select({ system_id }: StrictPick<Select, "system_id">) {
	return await db
		.select()
		.from(table)
		.where(eq(table.system_id, system_id))
		.orderBy(desc(table.enabled), desc(table.category), desc(table.name));
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

// ------ OTHERS --------

import { buildConflictUpdateColumns } from "$db/drizzle/upsert";
import { Reading } from "$collections/readings";
import { c } from "..";

export async function upsertMany(values: Insert[]) {
	return await db
		.insert(table)
		.values(values)
		.onConflictDoUpdate({
			target: [table.system_id, table.category, table.name, table.unit],
			set: buildConflictUpdateColumns(table, ["threshold", "enabled"]),
		})
		.returning();
}

export async function toggle(values: Unique) {
	return await db
		.update(table)
		.set({
			enabled: not(table.enabled),
		})
		.where(
			and(
				eq(table.system_id, values.system_id),
				eq(table.category, values.category),
				eq(table.name, values.name),
				eq(table.unit, values.unit),
			),
		)
		.returning()
		.then((v) => v[0]);
}

export async function selectAllUniqueWithoutThreshold({
	system_id,
}: StrictPick<Reading.Select, "system_id">) {
	return await db
		.selectDistinctOn(
			[
				c.readings.table.system_id,
				c.readings.table.category,
				c.readings.table.unit,
				c.readings.table.name,
			],
			{
				system_id: c.readings.table.system_id,
				category: c.readings.table.category,
				unit: c.readings.table.unit,
				name: c.readings.table.name,
			},
		)
		.from(c.readings.table)
		.leftJoin(
			table,
			and(
				eq(c.readings.table.system_id, table.system_id),
				eq(c.readings.table.category, table.category),
				eq(c.readings.table.unit, table.unit),
				eq(c.readings.table.name, table.name),
			),
		)
		.where(
			and(eq(c.readings.table.system_id, system_id), isNull(table.system_id)),
		)
		.orderBy(
			c.readings.table.system_id,
			c.readings.table.category,
			c.readings.table.unit,
			c.readings.table.name,
		);
}
