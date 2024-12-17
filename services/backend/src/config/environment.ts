import { exit } from "node:process";
import { Value } from "@sinclair/typebox/value";
import { env } from "bun";
import { t } from "elysia";

const optionalEnvironmentSchema = t.Object({
	MICROSOFT_TENANT_ID: t.String({ minLength: 1 }),
	MICROSOFT_CLIENT_ID: t.String({ minLength: 1 }),
	MICROSOFT_CLIENT_SECRET: t.String({ minLength: 1 }),
	MICROSOFT_REDIRECT_URI: t.String({ minLength: 1 }),
});

const requiredEnvironmentSchema = t.Object({
	DATABASE_URL: t.String({ minLength: 1 }),
	PROD: t.Boolean(),
});

const environmentSchema = t.Intersect([
	requiredEnvironmentSchema,
	optionalEnvironmentSchema,
]);

let cleanedEnv: unknown;
cleanedEnv = Value.Convert(environmentSchema, env);
cleanedEnv = Value.Clean(environmentSchema, cleanedEnv);

function parseEnvironment(
	schema: typeof requiredEnvironmentSchema | typeof environmentSchema,
) {
	if (Value.Check(schema, cleanedEnv) === false) {
		console.error("Errors while compiling config");
		const errors = Value.Errors(schema, env);
		for (const error of errors) {
			console.log(
				`Failed to parse ${"\x1b[33m"}${error.path.slice(1)}${"\x1b[0m"}: ${error.message}`,
			);
		}
		exit(1);
	}

	return Value.Encode(schema, cleanedEnv);
}

const input =
	env.PROD === "true" ? environmentSchema : requiredEnvironmentSchema;

export const environment = parseEnvironment(
	input,
) as typeof environmentSchema.static;
