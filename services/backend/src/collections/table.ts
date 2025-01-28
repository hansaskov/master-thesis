import { factoryAreas } from "./factory_areas/schema";
import { keys } from "./keys/schema";
import { organizations } from "./organizations/schema";
import { parts } from "./parts/schema";
import { partsToSystemModels } from "./parts_to_system_models/schema";
import { readings } from "./readings/schema";
import { sessions } from "./sessions/schema";
import { systemModels } from "./system_models/schema";
import { systems } from "./systems/schema";
import { systemsToFactoryAreas } from "./systems_to_factory_areas/schema";
import { systemsToParts } from "./systems_to_parts/schema";
import { userSettings } from "./user_settings/schema";
import { users } from "./users/schema";
import { usersToFactoryAreas } from "./users_to_factory_areas/schema";
import { usersToOrganizations } from "./users_to_organizations/schema";

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