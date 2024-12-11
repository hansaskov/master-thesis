import { and, eq } from "drizzle-orm";
import { Prettify } from "elysia/types";
import type { Types } from "../../..";
import type { StrictPick } from "../../../types/strict";
import { Table } from "../../model";
import { db } from "../../postgres";
import { systems } from "./schema";

export const systemQueries = {
	create: async (values: Types.SystemNew) =>
		await db
			.insert(systems)
			.values(values)
			.returning()
			.then((v) => v[0]),
	selectAll: async () =>
		await db
			.select()
			.from(systems),
	delete: async ({ id }: StrictPick<Types.System, "id">) =>
		await db
			.delete(systems)
			.where(eq(systems.id, id))
			.returning()
			.then((v) => v.at(0)),
};
