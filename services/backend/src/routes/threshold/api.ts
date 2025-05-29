import { authMiddleware } from "$auth/middleware";
import { Queries } from "$collections/queries";
import Elysia, { t } from "elysia";
import {
	insertThresholdSchema,
	selectThresholdSchema,
	uniqueThresholdSchema,
} from "./schema";

export const thresholdApi = new Elysia({ prefix: "threshold" })
	.use(authMiddleware)
	.get(
		"/",
		async ({ query }) => {
			return await Queries.threshold.select(query);
		},
		{
			isOrganization: true,
			query: t.Object({
				system_id: t.String(),
			}),
		},
	)
	.post(
		"/",
		async ({ body }) => {
			return await Queries.threshold.insertMany(body);
		},
		{
			isOrganizationAdmin: true,
			body: t.Array(insertThresholdSchema),
		},
	)
	.put(
		"/",
		async ({ body }) => {
			return await Queries.threshold.upsertMany(body);
		},
		{
			isOrganizationAdmin: true,
			body: t.Array(insertThresholdSchema),
		},
	)
	.get(
		"/available",
		async ({ query }) => {
			return await Queries.threshold.selectAllUniqueWithoutThreshold(query);
		},
		{
			isOrganizationAdmin: true,
			query: t.Object({
				system_id: t.String(),
			}),
		},
	)
	.put(
		"/toggle",
		async ({ body }) => {
			return await Queries.threshold.toggle(body);
		},
		{
			isOrganizationAdmin: true,
			body: uniqueThresholdSchema,
		},
	);
