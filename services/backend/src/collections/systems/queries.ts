import { db } from "$db/postgres";
import type { Types } from "$types/collection";
import type { StrictPick } from "$types/strict";
import { eq } from "drizzle-orm";
import { systems } from "./schema";

export const systemQueries = {
	create: async (values: Types.SystemNew) =>
		await db
			.insert(systems)
			.values(values)
			.returning()
			.then((v) => v[0]),
	selectAll: async () => await db.select().from(systems),
	selectAllOnOrgId: async (
		organization: StrictPick<Types.Organization, "id">,
	) =>
		await db
			.select()
			.from(systems)
			.where(eq(systems.organization_id, organization.id)),
	delete: async ({ id }: StrictPick<Types.System, "id">) =>
		await db
			.delete(systems)
			.where(eq(systems.id, id))
			.returning()
			.then((v) => v.at(0)),
};
