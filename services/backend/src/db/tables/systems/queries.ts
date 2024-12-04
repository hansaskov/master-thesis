import { and, eq } from "drizzle-orm";
import { Prettify } from "elysia/types";
import type { StrictPick } from "../../../types/strict";
import { Table } from "../../model";
import { db } from "../../postgres";
import { type Types, systems } from "./schema";

export const systemQueries = {
	create: async (values: Types.Systems.Select) =>
		await db
			.insert(systems)
			.values(values)
			.returning()
			.then((v) => v[0]),
	delete: async ({ id }: StrictPick<Types.Systems.Select, "id">) =>
		await db.delete(systems).where(eq(systems.id, id)),
};
