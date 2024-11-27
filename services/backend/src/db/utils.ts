/**
 * @lastModified 2024-10-10
 * @see https://elysiajs.com/recipe/drizzle.html#utility
 */
import { Kind, type TObject } from "@sinclair/typebox";
import {
	type BuildInsertSchema,
	type BuildSelectSchema,
	createInsertSchema,
	createSelectSchema,
} from "drizzle-typebox";

import type { Table } from "drizzle-orm";
import { error, t } from "elysia";
import { customAlphabet } from "nanoid";

type Spread<
	T extends TObject | Table,
	Mode extends "select" | "insert" | undefined,
> = T extends TObject<infer Fields>
	? {
			[K in keyof Fields]: Fields[K];
		}
	: T extends Table
		? Mode extends "select"
			? BuildSelectSchema<T, {}>
			: Mode extends "insert"
				? BuildInsertSchema<T, {}>
				: {}
		: {};

/**
 * Spread a Drizzle schema into a plain object
 */
export const spread = <
	T extends TObject | Table,
	Mode extends "select" | "insert" | undefined,
>(
	schema: T,
	mode?: Mode,
): Spread<T, Mode> => {
	const newSchema: Record<string, unknown> = {};
	let table;

	switch (mode) {
		case "insert":
		case "select":
			if (Kind in schema) {
				table = schema;
				break;
			}

			table =
				mode === "insert"
					? createInsertSchema(schema)
					: createSelectSchema(schema);

			break;

		default:
			if (!(Kind in schema)) throw new Error("Expect a schema");
			table = schema;
	}

	for (const key of Object.keys(table.properties))
		newSchema[key] = table.properties[key];

	return newSchema as any;
};

/**
* Spread a Drizzle Table into a plain object
*
* If `mode` is 'insert', the schema will be refined for insert
* If `mode` is 'select', the schema will be refined for select
* If `mode` is undefined, the schema will be spread as is, models will need to be refined manually
* @example
```
const schema = spread(table, 'insert')
const schema = spread(table, 'select')
```
*/
export const spreads = <
	T extends Record<string, TObject | Table>,
	Mode extends "select" | "insert" | undefined,
>(
	models: T,
	mode?: Mode,
): {
	[K in keyof T]: Spread<T[K], Mode>;
} => {
	const newSchema: Record<string, unknown> = {};
	const keys = Object.keys(models);

	for (const key of keys) newSchema[key] = spread(models[key], mode);

	return newSchema as any;
};

// Used for generating random ids for primary keys
export const generateRandomString = customAlphabet(
	"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
);

export const IsoDate = t
	.Transform(t.String({ format: "iso-date-time" }))
	.Decode((v) => new Date(v))
	.Encode((v) => v.toISOString());
