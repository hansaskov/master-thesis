import {
	factoryAreas,
	keys,
	organizations,
	parts,
	partsToSystemModels,
	readings,
	sessions,
	systemModels,
	systems,
	systemsToFactoryAreas,
	userSettings,
	users,
	usersToFactoryAreas,
	usersToOrganizations,
} from "./";

import { insertSystemModelsSchema } from "./system_models";

export * from "./organizations";
export * from "./systems";
export * from "./keys";
export * from "./readings";

export * from "./systems_to_factory_areas";
export * from "./factory_areas";

export * from "./system_models";
export * from "./parts_to_system_models";
export * from "./parts";

export * from "./users";
export * from "./user_settings";
export * from "./sessions";
export * from "./users_to_factory_areas";
export * from "./users_to_organizations";

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
    systemModels: {
        insert: insertSystemModelsSchema
    }
}