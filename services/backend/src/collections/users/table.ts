import { generateRandomString } from "$utils/random";
import { boolean, pgEnum, pgTable, text } from "drizzle-orm/pg-core";

export const providerEnum = pgEnum("providers", ["Github", "Microsoft"]);

export const table = pgTable("users", {
	id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(12)),
	name: text().notNull(),
	email: text(),
	email_verified: boolean().notNull().default(false),
	image: text(),
	is_superadmin: boolean().notNull().default(false),
	provider_name: providerEnum().notNull(),
	provider_id: text().notNull(),
});
