import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { seed } from "drizzle-seed";
import { db } from "$db/postgres";
import { users } from "$collections/users/schema";

const userData = [
    {
      id: 1,
      is_superadmin: true,
      name: 'John Doe',
      email: 'john@example.com',
      email_verified: true,
      image: null,
      provider_name: "Microsoft",
      provider_id: "test id"
    },
  ];

async function main() {
  await seed(db, { users: userData } );
}

main();
