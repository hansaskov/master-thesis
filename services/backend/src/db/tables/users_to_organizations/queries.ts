import { and, eq } from "drizzle-orm";
import { organizations, users, usersToOrganizations } from "..";
import type { Types } from "../../..";
import type { StrictPick } from "../../../types/strict";
import { db } from "../../postgres";

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
					eq(usersToOrganizations.organizationId, values.organizationId),
					eq(usersToOrganizations.userId, values.userId),
				),
			)
			.returning()
			.then((v) => v.at(0)),

	delete: async ({
		organizationId,
		userId,
	}: StrictPick<Types.UserToOrganization, "organizationId" | "userId">) =>
		await db
			.delete(usersToOrganizations)
			.where(
				and(
					eq(usersToOrganizations.organizationId, organizationId),
					eq(usersToOrganizations.userId, userId),
				),
			)
			.returning()
			.then((v) => v.at(0)),

	select: async ({
		organizationId,
		userId,
	}: StrictPick<Types.UserToOrganization, "organizationId" | "userId">) =>
		await db
			.select()
			.from(usersToOrganizations)
			.where(
				and(
					eq(usersToOrganizations.organizationId, organizationId),
					eq(usersToOrganizations.userId, userId),
				),
			)
			.then((v) => v.at(0)),
};
