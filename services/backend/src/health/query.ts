import { Table } from "$db/collections";
import { db } from "$db/postgres";

export const healthQueries = {
  health: async () =>
    db
      .select()
      .from(Table.organizations)
      .limit(1)
      .then((v) => v.length >= 0),
};
