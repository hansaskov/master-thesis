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
		"insert",
	),
};

export const Queries = {
	keys: keysQueries,
	readings: readingsQueries,
};
