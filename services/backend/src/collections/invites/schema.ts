import { rolesEnum } from "$collections/users_to_organizations/schema";
import type { PartialExcept, StrictPick } from "$types/strict";
import { generateRandomString } from "$utils/random";
import {
	boolean,
	index,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { users } from "../users/schema";

function dateInOneWeek() {
	const today = new Date();
	const nextWeek = new Date(today.setDate(today.getDate() + 7));
	return nextWeek;
}

export const invites = pgTable(
	"invites",
	{
		id: text()
			.notNull()
			.primaryKey()
			.$default(() => generateRandomString(20)),
		email: text().notNull(),
		organization_id: text().notNull(),
		inviter_id: text()
			.notNull()
			.references(() => users.id),
		is_accepted: boolean().notNull().default(false),
		expires_at: timestamp({ mode: "date" })
			.notNull()
			.$default(() => dateInOneWeek()),
		role: rolesEnum().notNull().default("User"),
	},
	(table) => [index().on(table.email, table.organization_id)],
);

export const insertInvitesSchema = createInsertSchema(invites, {
	email: t.String({ minLength: 1, format: "email" }),
});

export const selectInvitesSchema = createSelectSchema(invites, {
	email: t.String({ minLength: 1, format: "email" }),
});

export type Invites = typeof invites.$inferSelect;
export type InvitesNew = typeof invites.$inferInsert;
export type InvitesUpdate = PartialExcept<Invites, "organization_id" | "email">;
export type InvitesUnique = StrictPick<Invites, "organization_id" | "email">;
