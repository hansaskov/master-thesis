import { keysQueries } from "./keys/queries";
import { organizationQueries } from "./organizations/queries";
import { partQueries } from "./parts/queries";
import { readingsQueries } from "./readings/queries";
import { sessionQueries } from "./sessions/queries";
import { systemQueries } from "./systems/queries";
import { usersQueries } from "./users/queries";
import { usersToOrganizationsQueries } from "./users_to_organizations/queries";
import { systemModelQueries } from "./system_models/queries";
import { invitesQueries } from "./invites/queries";

export const Queries = {
	keys: keysQueries,
	readings: readingsQueries,
	sessions: sessionQueries,
	users: usersQueries,
	organizations: organizationQueries,
	usersToOrganizations: usersToOrganizationsQueries,
	systems: systemQueries,
	part: partQueries,
	systemModels: systemModelQueries,
	invites: invitesQueries
};
