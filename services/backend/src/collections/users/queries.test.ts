import { describe, expect, it } from "bun:test";
import { Queries } from "$collections/queries";
import { generateRandomString } from "$utils/random";

describe("user-queries", async () => {
	it("Select multiple users on organization", async () => {
		const organization = await Queries.organizations.create({
			name: "Trivision_test",
		});

		const user = await Queries.users.create({
			provider_id: generateRandomString(10),
			provider_name: "Microsoft",
			is_superadmin: true,
		});

		const user2 = await Queries.users.create({
			provider_id: generateRandomString(10),
			provider_name: "Microsoft",
			is_superadmin: false,
		});

		const relationship = await Queries.usersToOrganizations.create({
			organization_id: organization.id,
			user_id: user.id,
			role: "Admin",
		});

		const queried_users =
			await Queries.users.selectAllOnOrganization(organization);

		expect(queried_users.length).toEqual(1);
		expect(queried_users[0].id).toEqual(user.id);
	});
});
