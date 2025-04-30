import Elysia from "elysia";
import { authApi } from "./auth/api";
import { statusApi } from "./auth/status/api";
import { fileApi } from "./files/api";
import { healthApi } from "./health/api";
import { invitesApi } from "./invites/api";
import { keysApi } from "./keys/api";
import { organizationsApi } from "./organizations/api";
import { partsApi } from "./parts/api";
import { partsToSystemModelApi } from "./parts_to_system_models/api";
import { readingsApi } from "./readings/api";
import { seedApi } from "./seed/api";
import { systemHealthApi } from "./system_health/api";
import { systemModelsApi } from "./system_models/api";
import { systemsApi } from "./systems/api";
import { systemsToPartsApi } from "./systems_to_parts/api";
import { thresholdApi } from "./threshold/api";
import { usersApi } from "./users/api";
import { usersToOrganizationsApi } from "./users_to_organizations/api";
import { testApi } from "./test/api";

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
	.use(statusApi)
	.use(keysApi)
	.use(invitesApi)
	.use(partsToSystemModelApi)
	.use(fileApi)
	.use(systemsToPartsApi)
	.use(thresholdApi)
	.use(systemHealthApi)
	.use(testApi)
	.use(seedApi);
