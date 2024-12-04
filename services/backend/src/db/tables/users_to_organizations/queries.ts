import { and, eq } from "drizzle-orm";
import { Prettify } from "elysia/types";
import type { StrictOmit, StrictPick } from "../../../types/strict";
import { Table } from "../../model";
import { db } from "../../postgres";
import {
	type UserToOrganization,
	type UserToOrganizationNew,
	usersToOrganizations,
} from "./schema";

export const usersToOrganizationQueries = {
	create: async (values: UserToOrganizationNew) =>
		await db
			.insert(usersToOrganizations)
			.values(values)
			.returning()
			.then((v) => v[0]),
	select: async (values: StrictOmit<UserToOrganization, "role">) =>
		await db
			.select()
			.from(usersToOrganizations)
			.where(
				and(
					eq(usersToOrganizations.organization_id, values.organization_id),
					eq(usersToOrganizations.user_id, values.user_id),
				),
			)
			.then((v) => v.at(0)),
};
