import { describe, expect, it } from "bun:test";
import { generateRandomString } from "$utils/random";
import { c } from "..";

describe("user-queries", async () => {
	it("Select multiple users on organization", async () => {
		const organization = await c.organizations.insertOne({
			name: "Trivision_test",
		});

		const user = await c.users.insertOne({
			name: "Test User",
			provider_id: generateRandomString(10),
			provider_name: "Microsoft",
			is_superadmin: true,
		});

		const user2 = await c.users.insertOne({
			name: "Test User 2",
			provider_id: generateRandomString(10),
			provider_name: "Microsoft",
			is_superadmin: false,
		});

		const relationship = await c.usersToOrganizations.insertOne({
			organization_id: organization.id,
			user_id: user.id,
			role: "Admin",
		});

		const queried_users = await c.users.selectAllOnOrganization(organization);

		expect(queried_users.length).toEqual(1);
		expect(queried_users[0].id).toEqual(user.id);
	});
});
