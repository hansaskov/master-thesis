import { describe, expect, it } from "bun:test";
import { Queries } from "$collections/queries";

describe("Organization Queries", async () => {
	it("Select 1 organization on users", async () => {
		const organizations = await Queries.organizations.create({
			name: "Trivision_test",
		});

		const user = await Queries.users.create({
			first_name: "Test User",
			provider_id: "kgæajvpajnbir",
			provider_name: "Microsoft",
			is_superadmin: true,
		});

		const relationship = await Queries.usersToOrganizations.create({
			organization_id: organizations.id,
			user_id: user.id,
			role: "Admin",
		});

		const queried_organizations =
			await Queries.organizations.selectOrganizationsOnUser({
				id: user.id,
			});

		expect(queried_organizations[0].id).toBe(organizations.id);
		expect(queried_organizations[0].userRole).toBe(relationship.role);
	});

	it("Select multiple organizations on users", async () => {
		const organizations1 = await Queries.organizations.create({
			name: "Trivision_test",
		});

		const organizations2 = await Queries.organizations.create({
			name: "Thiese_ost_test",
		});

		const user = await Queries.users.create({
			first_name: "Test User",
			provider_id: "kgæajvpajnbir",
			provider_name: "Microsoft",
			is_superadmin: true,
		});

		const relationship1 = await Queries.usersToOrganizations.create({
			organization_id: organizations1.id,
			user_id: user.id,
			role: "Admin",
		});

		const relationship2 = await Queries.usersToOrganizations.create({
			organization_id: organizations2.id,
			user_id: user.id,
			role: "User",
		});

		const queried_organizations =
			await Queries.organizations.selectOrganizationsOnUser({
				id: user.id,
			});

		expect(queried_organizations).toContainEqual({
			id: organizations1.id,
			name: organizations1.name,
			userRole: relationship1.role,
		});
		expect(queried_organizations).toContainEqual({
			id: organizations2.id,
			name: organizations2.name,
			userRole: relationship2.role,
		});
	});
});
