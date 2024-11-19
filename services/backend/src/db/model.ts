import { t } from "elysia";
import { github } from "../auth/login/github";
import {
	factoryAreas,
	insertFactoryAreaSchema,
	insertKeysSchema,
	insertOrganizationsSchema,
	insertPartsSchema,
	insertReadingsSchema,
	insertSessionsSchema,
	insertSystemModelsSchema,
	insertSystemsSchema,
	insertUserSchema,
	insertUserSettingsSchema,
	keys,
	organizations,
	parts,
	partsToSystemModels,
	readings,
	selectKeysSchema,
	selectReadingsSchema,
	sessions,
	systemModels,
	systems,
	systemsToFactoryAreas,
	userSettings,
	users,
	usersToFactoryAreas,
	usersToOrganizations,
} from "./tables";
import { keysQueries } from "./tables/keys/queries";
import { readingsQueries } from "./tables/readings/queries";
import { sessionQueries } from "./tables/sessions/queries";
import { usersQueries } from "./tables/users/queries";
import { spreads } from "./utils";

export const Table = {
	organizations,
	systems,
	keys,
	readings,
	systemsToFactoryAreas,
	factoryAreas,
	systemModels,
	partsToSystemModels,
	parts,
	users,
	userSettings,
	sessions,
	usersToOrganizations,
	usersToFactoryAreas,
} as const;

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
		},
		"insert",
	),
	select: spreads(
		{
			keys: selectKeysSchema,
			readings: selectReadingsSchema,
		},
		"select",
	),
	cookie: {
		session: t.Cookie({
			sessionId: t.String({
				description: "Session cookie will be used to keep a user logged in",
				error: "Unauthorized access, due to invalid session cookie",
			}),
		}, ),
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

const testCookie = t.Required(Schema.cookie.github, {});

export const Queries = {
	keys: keysQueries,
	readings: readingsQueries,
	sessions: sessionQueries,
	users: usersQueries,
};
