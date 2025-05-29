import { pgEnum, pgTable, primaryKey, text } from "drizzle-orm/pg-core";

import { table as users } from "../users/table";
import { table as organizations} from "../organizations/table"

export const rolesEnum = pgEnum("users_to_provider_roles", ["Admin", "User"]);

export const table = pgTable(
	"users_to_organizations",
	{
		organization_id: text()
			.notNull()
			.references(() => organizations.id, { onDelete: "cascade" }),
		user_id: text()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		role: rolesEnum().notNull(),
	},
	(table) => [primaryKey({ columns: [table.organization_id, table.user_id] })],
);
