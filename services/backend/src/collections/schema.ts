import { spreads } from "$types/typebox";
import { t } from "elysia";
import { insertFactoryAreaSchema } from "./factory_areas/schema";
import { insertKeysSchema, selectKeysSchema } from "./keys/schema";
import {
	insertOrganizationsSchema,
	selectOrganizationsSchema,
} from "./organizations/schema";
import { insertPartsSchema, selectPartsSchema } from "./parts/schema";
import { insertReadingsSchema, selectReadingsSchema } from "./readings/schema";
import { insertSessionsSchema } from "./sessions/schema";
import { insertSystemModelsSchema } from "./system_models/schema";
import { insertSystemsSchema, selectSystemsSchema } from "./systems/schema";
import { insertUserSettingsSchema } from "./user_settings/schema";
import { insertUserSchema } from "./users/schema";
import { insertUserToOrganizationSchema } from "./users_to_organizations/schema";

export const Schema = {
	insert: spreads(
		{
			users: insertUserSchema,
			user_settings: insertUserSettingsSchema,
			sessions: insertSessionsSchema,
			organizations: insertOrganizationsSchema,
			factoryAreas: insertFactoryAreaSchema,
			systems: insertSystemsSchema,
			systemModels: insertSystemModelsSchema,
			readings: insertReadingsSchema,
			parts: insertPartsSchema,
			keys: insertKeysSchema,
			usersToOrganizations: insertUserToOrganizationSchema,
		},
		"insert",
	),
	select: spreads(
		{
			keys: selectKeysSchema,
			readings: selectReadingsSchema,
			organizations: selectOrganizationsSchema,
			systems: selectSystemsSchema,
			part: selectPartsSchema,
		},
		"select",
	),
	cookie: {
		session: t.Cookie({
			sessionId: t.String({
				description: "Session cookie will be used to keep a user logged in",
				error: { error: "Unauthorized access, due to invalid session cookie" },
			}),
		}),
		github: t.Cookie(
			{
				githubState: t.String(),
			},
			{
				path: "/",
				httpOnly: true,
				maxAge: 60 * 10,
				sameSite: "lax",
			},
		),
		microsoft: t.Cookie(
			{
				microsoftState: t.String(),
				microsoftCode: t.String(),
			},
			{
				path: "/",
				httpOnly: true,
				maxAge: 60 * 10,
				sameSite: "lax",
			},
		),
	},
};
