import { and, eq } from "drizzle-orm";
import type { User, UserNew } from "..";
import type { Types } from "../../..";
import type { StrictPick } from "../../../types/strict";
import { Table } from "../../model";
import { db } from "../../postgres";

export const usersQueries = {
	selectUniqueWithProvider: async (
		user: StrictPick<Types.User, "provider_name" | "provider_id">,
	) =>
		await db
			.select()
			.from(Table.users)
			.where(
				and(
					eq(Table.users.provider_name, user.provider_name),
					eq(Table.users.provider_id, user.provider_id),
				),
			)
			.then((v) => v.at(0)),
	create: async (user: Types.UserNew) => {
		return await db
			.insert(Table.users)
			.values(user)
			.returning()
			.then((v) => v[0]);
	},
};
