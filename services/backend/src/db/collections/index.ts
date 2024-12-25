export type * from "./keys/schema";
export type * from "./organizations/schema";
export type * from "./readings/schema";
export type * from "./systems/schema";

export type * from "./factory_areas/schema";
export type * from "./systems_to_factory_areas/schema";

export type * from "./parts/schema";
export type * from "./parts_to_system_models/schema";
export type * from "./system_models/schema";
export type * from "./systems_to_parts/schema";

export type * from "./sessions/schema";
export type * from "./user_settings/schema";
export type * from "./users/schema";
export type * from "./users_to_factory_areas/schema";
export type * from "./users_to_organizations/schema";

import { t } from "elysia";
import { spreads } from "../../types/typebox";
import { factoryAreas, insertFactoryAreaSchema } from "./factory_areas/schema";
import { keysQueries } from "./keys/queries";
import { insertKeysSchema, keys, selectKeysSchema } from "./keys/schema";
import { organizationQueries } from "./organizations/queries";
import {
	insertOrganizationsSchema,
	organizations,
	selectOrganizationsSchema,
} from "./organizations/schema";
import { partQueries } from "./parts/queries";
import { insertPartsSchema, parts, selectPartsSchema } from "./parts/schema";
import { partsToSystemModels } from "./parts_to_system_models/schema";
import { readingsQueries } from "./readings/queries";
import {
	insertReadingsSchema,
	readings,
	selectReadingsSchema,
} from "./readings/schema";
import { sessionQueries } from "./sessions/queries";
import { insertSessionsSchema, sessions } from "./sessions/schema";
import { insertSystemModelsSchema, systemModels } from "./system_models/schema";
import { systemQueries } from "./systems/queries";
import {
	insertSystemsSchema,
	selectSystemsSchema,
	systems,
} from "./systems/schema";
import { systemsToFactoryAreas } from "./systems_to_factory_areas/schema";
import { systemsToParts } from "./systems_to_parts/schema";
import { insertUserSettingsSchema, userSettings } from "./user_settings/schema";
import { usersQueries } from "./users/queries";
import { insertUserSchema, users } from "./users/schema";
import { usersToFactoryAreas } from "./users_to_factory_areas/schema";
import { usersToOrganizationsQueries } from "./users_to_organizations/queries";
import {
	insertUserToOrganizationSchema,
	usersToOrganizations,
} from "./users_to_organizations/schema";

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
	systemsToParts,
} as const;

export const Queries = {
	keys: keysQueries,
	readings: readingsQueries,
	sessions: sessionQueries,
	users: usersQueries,
	organizations: organizationQueries,
	usersToOrganizations: usersToOrganizationsQueries,
	systems: systemQueries,
	part: partQueries,
};

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
