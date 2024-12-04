import { and, eq } from "drizzle-orm";
import { Prettify } from "elysia/types";
import type { StrictPick } from "../../../types/strict";
import { Table } from "../../model";
import { db } from "../../postgres";
import { type UserToOrganizationNew, usersToOrganizations } from "./schema";

export const usersToOrganizationQueries = {
	create: async (values: UserToOrganizationNew) =>
		await db
			.insert(usersToOrganizations)
			.values(values)
			.returning()
			.then((v) => v[0]),
};
