import type { Insert, Select, Unique, Update } from "./types";
import { eq, and, sql, desc, between, asc } from "drizzle-orm";
import { db } from "$db/postgres";
import { table } from "./table";
import { System } from "$collections/systems";
import {
	PartialOmit,
	PartialPick,
	StrictOmit,
	StrictPick,
} from "$types/strict";

// ------ SELECT --------

export async function selectFirst() {
	return await db
		.select()
		.from(table)
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

// ------ OTHERS --------

export async function insertWithSystemId(
	values: StrictOmit<Insert, "system_id">[],
	{ system_id }: StrictPick<Insert, "system_id">,
) {
	const newValues = values.map((reading) => ({
		...reading,
		system_id,
	}));

	return await db.insert(table).values(newValues);
}

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
		.select()
		.from(table)
		.where(and(eq(table.system_id, system_id), between(table.time, start, end)))
		.orderBy(
			table.system_id,
			table.category,
			table.unit,
			table.name,
			asc(table.time),
		)
		.limit(limit ?? 1000);
}
export async function selectAllUnique({
	system_id,
	category,
	unit,
	name,
}: PartialOmit<StrictOmit<Unique, "time">, "system_id">) {
	return await db
		.selectDistinctOn([table.system_id, table.category, table.unit, table.name])
		.from(table)
		.where(
			and(
				eq(table.system_id, system_id),
				category ? eq(table.category, category) : undefined,
				unit ? eq(table.unit, unit) : undefined,
				name ? eq(table.name, name) : undefined,
			),
		)
		.orderBy(
			table.system_id,
			table.category,
			table.unit,
			table.name,
			desc(table.time),
		);
}
