<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { organizationStore } from '$lib/stores/organization.svelte';
	import type { Types } from 'backend';
	import { Ellipsis, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { dialogStore } from '$lib/stores/dialog.svelte';
	import EditOrganizationDialogBody from '$lib/components/EditOrganizationDialogBody.svelte';
	import AlertDialogBody from '$lib/components/AlertDialogBody.svelte';

	organizationStore.refresh();

	let pageSize = 10;
	let currentPage = $state(0);
	let startIndex = $derived(currentPage * pageSize);
	let endIndex = $derived((currentPage + 1) * pageSize);
	let visibleOrganizations = $derived(organizationStore.organizations.slice(startIndex, endIndex));
	let totalOrganizations = $derived(organizationStore.organizations.length);
	let totalPages = $derived(Math.ceil(totalOrganizations / pageSize));

	function prevPage() {
		if (currentPage > 0) {
			currentPage--;
		}
	}

	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
		}
	}

	let newOrganization = $state<Types.OrganizationNew>({
		name: ''
	});
</script>

<Card.Root class="col-span-1 md:col-span-2">
	<Card.Header>
		<Card.Title>Organization Management</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="mb-6">
			<Label for="new-organization">Add New Organization</Label>
			<form
				onsubmit={(e) => {
					e.preventDefault();
					organizationStore.add(newOrganization);
					newOrganization.name = '';
				}}
				class="flex gap-2"
			>
				<Input placeholder="Enter organization name" bind:value={newOrganization.name} />
				<Button type="submit">Add Organization</Button>
			</form>
		</div>

		<Table.Root>
			<Table.Caption>
				<Button variant="outline" onclick={() => prevPage()} disabled={currentPage === 0}>
					<ChevronLeft class="w-2 h-2" />
				</Button>
				Showing {startIndex + 1}–{startIndex + visibleOrganizations.length}
				of {totalOrganizations} results
				<Button
					variant="outline"
					onclick={() => nextPage()}
					disabled={currentPage + 1 === totalPages}
				>
					<ChevronRight class="w-2 h-2" />
				</Button>
			</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head class="text-right">Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each visibleOrganizations as organization}
					<Table.Row>
						<Table.Cell>{organization.name}</Table.Cell>
						<Table.Cell class="text-right">
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<Button variant="ghost" size="icon">
										<Ellipsis class="h-4 w-4" />
										<span class="sr-only">Open menu</span>
									</Button>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									<DropdownMenu.Label>Actions</DropdownMenu.Label>
									<DropdownMenu.Separator />
									<DropdownMenu.Item
										onclick={() => {
											dialogStore.open({
												title: `Update ${organization.name}`,
												description:
													'This action will update the name of the selected organization',
												component: EditOrganizationDialogBody,
												props: organization
											});
										}}
									>
										Edit Organization
									</DropdownMenu.Item>
									<DropdownMenu.Separator />
									<DropdownMenu.Item
										onclick={() => {
											dialogStore.open({
												title: 'Are you absolutely sure?',
												description:
													"This action cannot be undone. This will permanently delete the organization and all of it's systems",
												component: AlertDialogBody,
												props: { onsubmit: () => organizationStore.remove(organization) }
											});
										}}
										class="text-red-600"
									>
										Remove Organization
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
