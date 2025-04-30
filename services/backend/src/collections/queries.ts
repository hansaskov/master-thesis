import { invitesQueries } from "./invites/queries";
import { keysQueries } from "./keys/queries";
import { organizationQueries } from "./organizations/queries";
import { partQueries } from "./parts/queries";
import { partsToSystemModelsQueries } from "./parts_to_system_models/queries";
import { readingsQueries } from "./readings/queries";
import { readings5minAggQueries } from "./readings_5min_agg/queries";
import { sessionQueries } from "./sessions/queries";
import { SystemHealthQueries } from "./system_health/queries";
import { systemModelQueries } from "./system_models/queries";
import { systemQueries } from "./systems/queries";
import { systemsToPartsQueries } from "./systems_to_parts/queries";
import { testQueries } from "./test/queries";
import { thresholdQueries } from "./threshold/queries";
import { usersQueries } from "./users/queries";
import { usersToOrganizationsQueries } from "./users_to_organizations/queries";

export const Queries = {
	keys: keysQueries,
	readings: readingsQueries,
	readings_5min_agg: readings5minAggQueries,
	sessions: sessionQueries,
	users: usersQueries,
	organizations: organizationQueries,
	usersToOrganizations: usersToOrganizationsQueries,
	systems: systemQueries,
	part: partQueries,
	systemModels: systemModelQueries,
	invites: invitesQueries,
	partsToSystemModels: partsToSystemModelsQueries,
	systemsToParts: systemsToPartsQueries,
	threshold: thresholdQueries,
	systemHealth: SystemHealthQueries,
	test: testQueries,
};
