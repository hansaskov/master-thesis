import Elysia from "elysia";
import { authApi } from "./auth/api";
import { healthApi } from "./health/api";
import { invitesApi } from "./invites/api";
import { keysApi } from "./keys/api";
import { organizationsApi } from "./organizations/api";
import { partsApi } from "./parts/api";
import { partsToSystemModelApi } from "./parts_to_system_models/api";
import { readingsApi } from "./readings/api";
import { systemModelsApi } from "./system_models/api";
import { systemsApi } from "./systems/api";
import { usersApi } from "./users/api";
import { usersToOrganizationsApi } from "./users_to_organizations/api";

export const api = new Elysia({ prefix: "/api" })
	.use(authApi)
	.use(healthApi)
	.use(organizationsApi)
	.use(partsApi)
	.use(readingsApi)
	.use(systemsApi)
	.use(usersToOrganizationsApi)
	.use(systemModelsApi)
	.use(usersApi)
	.use(keysApi)
	.use(invitesApi)
	.use(partsToSystemModelApi);
