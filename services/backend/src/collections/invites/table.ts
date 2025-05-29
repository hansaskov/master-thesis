import { rolesEnum } from "$collections/users_to_organizations/table";
import { generateRandomString } from "$utils/random";
import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { table as users } from "../users/table";

function dateInOneWeek() {
	const today = new Date();
	const nextWeek = new Date(today.setDate(today.getDate() + 7));
	return nextWeek;
}

export const table = pgTable(
	"invites",
	{
		id: text()
			.notNull()
			.primaryKey()
			.$default(() => generateRandomString(20)),
		organization_id: text().notNull(),
		inviter_id: text().references(() => users.id, { onDelete: "set null" }),
		email: text().notNull(),
		is_accepted: boolean().notNull().default(false),
		expires_at: timestamp({ mode: "date" })
			.notNull()
			.$default(() => dateInOneWeek()),
		role: rolesEnum().notNull().default("User"),
	},
	(table) => [index().on(table.email, table.organization_id)],
);
