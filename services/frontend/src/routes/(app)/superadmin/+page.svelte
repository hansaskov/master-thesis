<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import AlertDialogBody from '$lib/components/AlertDialogBody.svelte';
	import { partsStore } from '$lib/stores/parts.svelte';
	import { organizationStore } from '$lib/stores/organization.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { ChevronDown, Ellipsis, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { dialogStore } from '$lib/stores/dialog.svelte';
	import EditOrganizationDialogBody from '$lib/components/EditOrganizationDialogBody.svelte';
	import type { Types } from 'backend';
	import SpareParts from './SpareParts.svelte';
	import { systemModelStore } from '$lib/stores/system-models.svelte';
	import { partsToSystemModelStore } from '$lib/stores/parts-to-system-models.svelte';
	import { userStore } from '$lib/stores/user.svelte'

	async function handleRoleChange(id: string, newValue: boolean) {
		await userStore.edit(id, newValue);
	}

	let totalItems = userStore.allUsers.current.length;
	let pageSize = 10;
	let currentPage = $state(1);

	// Computed values
	let totalPages = $derived(Math.ceil(totalItems / pageSize));

	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
		}
	}

	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
		}
	}

	let searchTerm = $state('');
	const itemsPerPage = 10;
	
	// user pagination
	let userPage = $state(1);
	// let filteredUsers = $derived(userStore.allUsers.current.filter(user => 
	// 	user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
	// 	user.email?.toLowerCase().includes(searchTerm.toLowerCase())));
	// let visibleUsers = $derived(filteredUsers.slice(0, userPage * itemsPerPage));
	// let totalFilteredUsers = $derived(filteredUsers.length);
	// let userShowingCount = $derived(Math.min(visibleUsers.length, totalFilteredUsers));

	let filteredUsers = $derived(userStore.allUsers.current.filter(user => 
		user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
		user.email?.toLowerCase().includes(searchTerm.toLowerCase())));
	let totalFilteredUsers = $derived(filteredUsers.length);
	let startIndex = $derived((currentPage-1) * pageSize);
	let endIndex = $derived(currentPage * pageSize);
	let visibleUsers = $derived(filteredUsers.slice(startIndex, endIndex));

	
	// organization pagination
	let organizationPage = $state(1);
	let visibleOrganizations = $derived(organizationStore.organizations.slice(0, organizationPage * itemsPerPage));
	let totalOrganizations = $derived(organizationStore.organizations.length);
	let organizationShowingCount = $derived(Math.min(visibleOrganizations.length, totalOrganizations));

	// Reset pagination when search changes
	$effect(() => {
		searchTerm; // Track search term dependency
		userPage = 1;
	});

	function showMore(card: string) {
		switch (card) {
			case 'users':
				userPage += 1;
				break;
			case 'organizations':
				organizationPage += 1;
				break;
			default:
				console.log("could not find which pagination to update");
				break;
		}
	}
	
	function showLess(card: string) {
		switch (card) {
			case 'users':
				if (userPage > 1)
					userPage -= 1;
				break;
			case 'organizations':
				if (organizationPage > 1)
					organizationPage -= 1;
				break;
			default:
				console.log("could not find which pagination to update");
				break;
		}
	}

	let selectedParts = $state<Types.Part[]>([]);
	let removedParts = $state<Types.Part[]>([]);
	$inspect(selectedParts);

	$inspect(removedParts);

	async function updateAllRelations(system_model_id: string) {
		await partsToSystemModelStore.batchUpdate({
			additions: selectedParts.map((part) => ({
				part_id: part.id,
				system_model_id
			})),
			deletions: removedParts.map((part) => ({
				part_id: part.id,
				system_model_id
			}))
		});

		selectedParts = [];
		removedParts = [];

		await Promise.all([systemModelStore.refresh(), partsStore.refresh()]);
	}

	function togglePartSelection(part: Types.Part, checked: boolean) {
		if (checked) {
			selectedParts = [...selectedParts, part];
			removedParts = removedParts.filter((p) => p !== part);
		} else {
			removedParts = [...removedParts, part];
			selectedParts = selectedParts.filter((p) => p !== part);
		}
	}

	function isPartInSystemModel(part: Types.Part, model_parts: Types.Part[]): boolean {
		return model_parts.some((modelPart) => modelPart.id === part.id);
	}

	function getUniqueParts(dataParts: Types.Part[], allParts: Types.Part[]) {
		return allParts.filter((part) => !dataParts.some((dp) => dp.id === part.id));
	}

	let newOrganization = $state<Types.OrganizationNew>({
		name: ''
	});

	let selectedModel: number | null = $state(null);
	let selectedOrg = $state('');

	$inspect(selectedOrg);

	type SystemModelType = Types.SystemNew['system_model'];

	let selectedType = $state<SystemModelType>('VisioPointer');

	$inspect(selectedType);

	let newSystem = $state<Types.SystemNew>({
		name: '',
		organization_id: '',
		system_model: 'VisioPointer'
	});

	$effect(() => {
		newSystem.organization_id = selectedOrg;
	});

	$effect(() => {
		newSystem.system_model = selectedType;
	});

	function toggleModel(index: number) {
		selectedModel = selectedModel === index ? null : index;
	}

	let selectedEdit: number | null = $state(null);
	function toggleEdit(index: number, system_model_id: string) {
		if (selectedModel === index) {
			updateAllRelations(system_model_id);
		}
		selectedEdit = selectedEdit === index ? null : index;
	}

	organizationStore.refresh();
	systemModelStore.refresh();
	userStore.loadAllUser();
</script>

<div class="md:container">
	<h1 class="mb-6 text-3xl font-bold">Superadmin Settings</h1>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<Card.Root class="col-span-1 md:col-span-2">
			<Card.Header>
				<Card.Title>User Management</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="space-y-2">
					<Label>Search Users</Label>
					<Input 
					  bind:value={searchTerm}
					  placeholder="Search by name or email..."
					  class="max-w-[400px]"
					/>
				</div>

				<Table.Root class="table-fixed">
					<Table.Caption>
						<!-- {#if userShowingCount < totalFilteredUsers}
							<Button
								variant="outline"
								onclick={() => showMore("users")}
							>
								Show more
							</Button>
						{:else}
							{#if userShowingCount > 10}
								<Button
									variant="outline"
									onclick={() => showLess("users")}
								>
									Show less
								</Button>
							{/if}
						{/if} -->
						<Button
								variant="outline"
								onclick={() => prevPage()}
								disabled={currentPage === 1}
							>
							<ChevronLeft class="w-2 h-2" />
						</Button>
						Showing {startIndex + 1}–{startIndex + visibleUsers.length}
          				of {totalFilteredUsers} results
						<Button
								variant="outline"
								onclick={() => nextPage()}
								disabled={currentPage === totalPages}
							>
							<ChevronRight class="w-2 h-2" />
						</Button>
					</Table.Caption>
					<Table.Header>
						<Table.Row>
							<Table.Head class="text-left w-28">
								Name
							</Table.Head> 
							<Table.Head class="hidden md:table-cell text-left">
								Email
							</Table.Head>
							<Table.Head class="text-right">
								Role
							</Table.Head>
						</Table.Row>
					</Table.Header>
					{#each visibleUsers as user}
						<Table.Row>
							<Table.Cell>
								{user.name}
							</Table.Cell>
							<Table.Cell class="hidden md:table-cell">
								{user.email}
							</Table.Cell>
							<Table.Cell class="text-right">
								<DropdownMenu.Root>
									<DropdownMenu.Trigger class="">
										<Button variant="ghost" class="">
											<span>{user.is_superadmin ? 'Superadmin' : 'User'}</span>
											<ChevronDown class="h-4 w-4" />
										</Button>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="end">
										<DropdownMenu.Label>Change Role</DropdownMenu.Label>
										<DropdownMenu.Separator />
										<DropdownMenu.Item
											onclick={() => handleRoleChange(user.id, true)}
										>
											Superadmin
										</DropdownMenu.Item>
										<DropdownMenu.Item
											onclick={() => handleRoleChange(user.id, false)}
										>
											User
										</DropdownMenu.Item>
										</DropdownMenu.Content>
								</DropdownMenu.Root>
							</Table.Cell>
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell colspan={3} class="text-center">
								{searchTerm ? `No users found matching "${searchTerm}"` : 'No users found'}
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Root>
			</Card.Content>
		</Card.Root>

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
						{#if organizationShowingCount < totalOrganizations}
							<Button
								variant="outline"
								onclick={() => showMore("organizations")}
							>
								Show more
							</Button>
						{:else if organizationShowingCount > totalOrganizations}
							<Button
								variant="outline"
								onclick={() => showLess("organizations")}
							>
								Show less
							</Button>
						{/if}
						<br> Showing {organizationShowingCount} of {totalOrganizations} results
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

		<Card.Root class="col-span-1 md:col-span-2">
			<Card.Header>
				<Card.Title>Vision System Management</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="mb-6">
					<Label for="new-model">Name of Vision Systems</Label>
					<div class="space-y-4">
						<Table.Root>
							<Table.Caption>List of Vision Systems</Table.Caption>
							<Table.Header>
								<Table.Row class="justify-between">
									<Table.Head>Name</Table.Head>
									<Table.Head></Table.Head>
									<Table.Head class="text-right">Actions</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each systemModelStore.systemModels as data, index}
									<Table.Row onclick={() => (selectedType = data.name)}>
										<Table.Cell>{data.name}</Table.Cell>
										<Table.Cell></Table.Cell>
										<Table.Cell class="justify-end flex gap-4">
											{#if selectedModel === index}
												<Button
													variant="outline"
													size="sm"
													onclick={() => toggleEdit(index, data.id)}
												>
													{selectedEdit === index ? 'Save' : 'Edit'}
												</Button>
											{/if}
											<Button variant="outline" size="sm" onclick={() => toggleModel(index)}>
												{selectedModel === index ? 'Hide Parts' : 'Show Parts'}
											</Button>
										</Table.Cell>
									</Table.Row>
									<!-- Parts List (Visible when model is selected) -->
									{#if selectedModel === index}
										{#if data.parts && data.parts.length > 0}
											<Table.Row class="bg-muted justify-between">
												<Table.Cell class="text-muted-foreground">Part Name</Table.Cell>
												<Table.Cell class="text-muted-foreground"></Table.Cell>
												<Table.Cell class="text-muted-foreground text-right">Image</Table.Cell>
											</Table.Row>
											{#each data.parts as part}
												<Table.Row class="text-xs">
													<Table.Cell class="text-left">
														{#if selectedEdit === index}
															<Checkbox
																checked={selectedParts.includes(part) ||
																	isPartInSystemModel(part, data.parts)}
																onCheckedChange={(value) => togglePartSelection(part, value)}
															/>
														{/if}
														{part.name}
													</Table.Cell>
													<Table.Cell></Table.Cell>
													<Table.Cell>{part.image}</Table.Cell>
												</Table.Row>
											{/each}
											{#if selectedEdit === index}
												{#each getUniqueParts(data.parts, partsStore.parts) as part}
													<Table.Row class="text-xs">
														<Table.Cell>
															<Checkbox
																checked={selectedParts.includes(part) ||
																	isPartInSystemModel(part, data.parts)}
																onCheckedChange={(value) => togglePartSelection(part, value)}
															/>
															{part.name}
														</Table.Cell>
														<Table.Cell>
															{part.image}
														</Table.Cell>
													</Table.Row>
												{/each}
											{/if}
										{/if}
									{/if}
								{/each}
							</Table.Body>
						</Table.Root>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<SpareParts />
	</div>
</div>
