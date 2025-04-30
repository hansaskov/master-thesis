import { organizations } from "$collections/organizations/schema";
import { parts } from "$collections/parts/schema";
import { users } from "$collections/users/schema";
import { db } from "$db/postgres";


export const testQueries = {
    deleteDatabase: async () => {
	    await db.delete(users);
        await db.delete(organizations);
        await db.delete(parts);
    }
}