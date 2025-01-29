import Elysia from "elysia";
import { authApi } from "./auth/api";
import { healthApi } from "./health/api";
import { organizationsApi } from "./organizations/api";
import { partsApi } from "./parts/api";
import { readingsApi } from "./readings/api";
import { systemsApi } from "./systems/api";
import { usersToOrganizationsApi } from "./users_to_organizations/api";

export const api = new Elysia({ prefix: "/api" })
	.use(authApi)
	.use(healthApi)
	.use(organizationsApi)
	.use(partsApi)
	.use(readingsApi)
	.use(systemsApi)
	.use(usersToOrganizationsApi);
	
