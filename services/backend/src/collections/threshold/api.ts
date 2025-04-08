import { Queries } from "$collections/queries";
import Elysia, { t } from "elysia";
import {
	insertThresholdSchema,
	selectThresholdSchema,
	uniqueThresholdSchema,
} from "./schema";
import { authMiddleware } from "$auth/middleware";

export const thresholdApi = new Elysia({ prefix: "threshold" })
	.use(authMiddleware)
	.post(
		"/",
		async ({ body }) => {
			await Queries.threshold.insertMany(body);
		},
		{
			isOrganizationAdmin: true,
			body: t.Array(insertThresholdSchema),
		},
	)
	.get(
		"/",
		async ({ params }) => {
			await Queries.threshold.select(params);
		},
		{
			isOrganization: true,
			params: t.Object({
				system_id: t.String(),
			}),
		},
	)
	.get(
		"/available",
		async ({ params }) => {
			await Queries.threshold.selectAllUniqueWithoutThreshold(params);
		},
		{
			isOrganizationAdmin: true,
			params: t.Object({
				system_id: t.String(),
			}),
		},
	)
	.put(
		"/toggle",
		async ({ body }) => {
			await Queries.threshold.toggle(body);
		},
		{
			isOrganizationAdmin: true,
			body: uniqueThresholdSchema,
		},
	);
