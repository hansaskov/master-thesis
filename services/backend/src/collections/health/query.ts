import { Table } from "$collections/table";
import { db } from "$db/postgres";

export const healthQueries = {
	health: async () =>
		db
			.select()
			.from(Table.users)
			.limit(1)
			.then((v) => v.length >= 0),
};
