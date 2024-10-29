import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";
import { generateRandomString } from "../../utils";
import { systems } from "..";

export const keys = pgTable("keys", {
	public_id: text()
		.primaryKey()
		.notNull()
		.$default(() => generateRandomString(22)),
	private_id: text()
		.notNull()
		.references(() => systems.id, { onDelete: "cascade" }),
});

export const insertKeysSchema = createInsertSchema(keys, {
	private_id: t.String({ minLength: 1 }),
});
