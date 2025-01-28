import { db } from "$db/postgres";
import type { Types } from "$types/index";
import type { StrictPick } from "$types/strict";
import { eq } from "drizzle-orm";
import { parts } from "./schema";

export const partQueries = {
	delete: async ({ id }: StrictPick<Types.Part, "id">) =>
		await db
			.delete(parts)
			.where(eq(parts.id, id))
			.returning()
			.then((v) => v.at(0)),
	create: async (values: Types.PartNew) =>
		await db
			.insert(parts)
			.values(values)
			.returning()
			.then((v) => v[0]),
	update: async (values: Types.PartUpdate) =>
		await db
			.update(parts)
			.set(values)
			.where(eq(parts.id, values.id))
			.returning()
			.then((v) => v.at(0)),
	selectAll: async () => await db.select().from(parts),
};
