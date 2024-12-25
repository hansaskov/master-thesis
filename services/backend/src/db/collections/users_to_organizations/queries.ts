import { and, eq } from "drizzle-orm";

import { db } from "$db/postgres";
import type { Types } from "$types/index";
import type { StrictPick } from "../../../types/strict";
import { usersToOrganizations } from "./schema";

export const usersToOrganizationsQueries = {
	create: async (values: Types.UserToOrganizationNew) =>
		await db
			.insert(usersToOrganizations)
			.values(values)
			.returning()
			.then((v) => v[0]),
	update: async (values: Types.UserToOrganizationUpdate) =>
		await db
			.update(usersToOrganizations)
			.set(values)
			.where(
				and(
					eq(usersToOrganizations.organization_id, values.organization_id),
					eq(usersToOrganizations.user_id, values.user_id),
				),
			)
			.returning()
			.then((v) => v.at(0)),

	delete: async ({
		organization_id,
		user_id,
	}: StrictPick<Types.UserToOrganization, "organization_id" | "user_id">) =>
		await db
			.delete(usersToOrganizations)
			.where(
				and(
					eq(usersToOrganizations.organization_id, organization_id),
					eq(usersToOrganizations.user_id, user_id),
				),
			)
			.returning()
			.then((v) => v.at(0)),

	select: async ({
		organization_id,
		user_id,
	}: StrictPick<Types.UserToOrganization, "organization_id" | "user_id">) =>
		await db
			.select()
			.from(usersToOrganizations)
			.where(
				and(
					eq(usersToOrganizations.organization_id, organization_id),
					eq(usersToOrganizations.user_id, user_id),
				),
			)
			.then((v) => v.at(0)),
};
