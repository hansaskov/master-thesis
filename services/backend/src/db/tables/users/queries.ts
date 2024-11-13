import { eq } from "drizzle-orm";
import type { UserNew } from "..";
import { Table } from "../../model";
import { db } from "../../postgres";

export const usersQueries = {
	selectUniqueWithMicrosoftId: async (microsoftId: string) =>
		await db
			.select()
			.from(Table.users)
			.where(eq(Table.users.microsoft_id, microsoftId))
			.then((v) => v.at(0)),
	create: async (user: UserNew) => {
		return await db
			.insert(Table.users)
			.values(user)
			.returning()
			.then((v) => v[0]);
	},
};
