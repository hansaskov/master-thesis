<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Switch from '$lib/components/ui/switch';
	import * as Alert from '$lib/components/ui/alert';
	import { writable } from 'svelte/store';

	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import Copy from 'lucide-svelte/icons/copy';
	import AlertCircle from 'lucide-svelte/icons/circle-alert';
	import { faker } from '@faker-js/faker';

	let organizationName = 'My Organization';
	let organizationSettings = {
		notificationEmails: true,
		publicProfile: false
	};
	
	let users = [
		{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', avatarUrl: '' },
		{ id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', avatarUrl: '' }
	];
	let newUserEmail = '';
	let newSystemName = '';
	let visionSystems = writable<string[]>(['System A', 'System B']);
	let generatedOnboardingUrl = '';
	let showOnboardingUrl = false;

	let onboardingInvitations = [
		{ email: 'pendinguser@example.com', status: 'pending' },
		{ email: 'completeduser@example.com', status: 'completed' }
	];

	$: usersAndInvites = users.map((user) => ({
		...user,
		onboardingStatus:
			onboardingInvitations.find((invite) => invite.email === user.email)?.status || 'Not Invited'
	}));

	function updateOrganizationName() {
		console.log('Organization name updated:', organizationName);
	}

	function toggleSetting(settingKey: keyof typeof organizationSettings) {
		organizationSettings[settingKey] = !organizationSettings[settingKey];
		console.log(`Setting ${settingKey} updated to`, organizationSettings[settingKey]);
	}

	function addUser() {
		if (newUserEmail) {
			users = [
				...users,
				{ id: users.length + 1, name: '', email: newUserEmail, role: 'User', avatarUrl: '' }
			];
			onboardingInvitations = [
				...onboardingInvitations,
				{ email: newUserEmail, status: 'pending' }
			];
			console.log('New user invited:', newUserEmail);
			newUserEmail = '';
		}
	}

	function updateUserRole(userId: number, newRole: string) {
		users = users.map((user) => (user.id === userId ? { ...user, role: newRole } : user));
		console.log('User role updated:', userId, newRole);
	}

	function removeUser(userId: number) {
		users = users.filter((user) => user.id !== userId);
		console.log('User removed:', userId);
	}

	function addVisionSystem() {
		if (newSystemName) {
			visionSystems.update((systems) => [...systems, newSystemName]);
			console.log('New vision system added:', newSystemName);
			newSystemName = '';
		}
	}

	function removeVisionSystem(systemName: string) {
		visionSystems.update((systems) => systems.filter((system) => system !== systemName));
		console.log('vision system removed:', systemName);
	}
	function generateOnboardingUrl() {
		generatedOnboardingUrl = `https://example.com/onboard/${Math.random().toString(36).substring(7)}`;
		showOnboardingUrl = true;
		console.log('Onboarding URL generated:', generatedOnboardingUrl);
	}

	function resendOnboardingEmail(email: string) {
		console.log('Resend onboarding email to:', email);
		// TODO: Implement email resend functionality
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text).then(() => {
			console.log('Copied to clipboard');
			// You could add a toast notification here
		});
	}

	let newOrganization = '';
	let organizations = [
		{ id: 1, name: 'TriVision A/S' },
		{ id: 2, name: 'Vestkraft' }
	];

	function addOrganization() {
		if (newOrganization) {
			organizations = [
				...organizations,
				{ id: organizations.length + 1, name: newOrganization, }
			];
			console.log('New organization added:', newOrganization);
			newOrganization = '';
		}
	}

	function editOrganization(organizationName: string) {

	}

	function removeOrganization(organizationName: string) {
		organizations = organizations.filter((organization) => organization.name !== organizationName);
		console.log('organization removed:', organizationName);
	}

	let models = [
		{
			name: "Model A",
			parts: ["Part 1", "Part 2", "Part 3"],
		},
		{
			name: "Model B",
			parts: ["Parts 4", "Parts 1"],
		}
	]

	let newModelName = '';
	let selectedModel: any = null;

	let parts = [
    	{ number: "001", name: "Part 1", image: "https://via.placeholder.com/50" },
    	{ number: "002", name: "Part 2", image: "https://via.placeholder.com/50" },
    	{ number: "003", name: "Part 3", image: "https://via.placeholder.com/50" },
    	{ number: "004", name: "Part 4", image: faker.image.urlPicsumPhotos({ width: 64, height: 64 }) }
  	];
	let newPartNumber = '';
	let newPartName = '';
	let newPartImage = '';

	function addPart() {
		if (newPartNumber && newPartName &&  newPartImage) {
			parts = [...parts, { number: newPartNumber, name: newPartName, image: newPartImage }];
		}
		newPartNumber = '';
		newPartName = '';
		newPartImage = '';
	}

	function removePart(partIndex: number) {
		parts = parts.filter((_, i) => i !== partIndex);
	}

	function addModel() {
		if (newModelName) {
		models = [...models, { name: newModelName, parts: [] }];
		newModelName = "";
		}
  	}

	function removeModel(index: any) {
    	models = models.filter((_, i) => i !== index);
  	}

	function addPartToModel(modelIndex: any) {
		if (newPartName && selectedModel === modelIndex) {
			models[modelIndex].parts = [...models[modelIndex].parts, newPartName];
			newPartName = "";
		}
  	}

	function removePartFromModel(modelIndex: number, partIndex: number) {
		models[modelIndex].parts = models[modelIndex].parts.filter((_, i) => i !== partIndex)
	}

	function toggleModel(index: any) {
    	selectedModel = selectedModel === index ? null : index;
  	}

	
</script>

<div class="container mx-auto px-4 py-4">
	<h1 class="mb-6 text-3xl font-bold">Settings</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<Card.Root class="col-span-1 md:col-span-2">
			<Card.Header>
				<Card.Title>User Management</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="mb-6">
					<Label for="new-user">Invite New User</Label>
					<div class="flex gap-2">
						<Input id="new-user" type="email" placeholder="Enter email" bind:value={newUserEmail} />
						<Button on:click={addUser}>Invite & Onboard</Button>
					</div>
				</div>

				{#if showOnboardingUrl}
					<Alert.Root class="mb-4">
						<AlertCircle class="h-4 w-4" />
						<Alert.Title>Onboarding URL Generated</Alert.Title>
						<Alert.Description>
							<div class="flex items-center gap-2">
								<Input value={generatedOnboardingUrl} readonly />
								<Button size="sm" on:click={() => copyToClipboard(generatedOnboardingUrl)}>
									<Copy class="mr-2 h-4 w-4" />
									Copy
								</Button>
							</div>
						</Alert.Description>
					</Alert.Root>
				{/if}

				<Table.Root>
					<Table.Caption>Users and Onboarding Status</Table.Caption>
					<Table.Header>
						<Table.Row>
							<Table.Head class="w-[300px]">User</Table.Head>
							<Table.Head>Role</Table.Head>
							<Table.Head>Onboarding Status</Table.Head>
							<Table.Head class="text-right">Actions</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each usersAndInvites as person}
							<Table.Row>
								<Table.Cell>
									<div class="flex items-center space-x-4">
										<Avatar.Root>
											<Avatar.Image src={person.avatarUrl} alt={person.name} />
											<Avatar.Fallback class="font-semibold uppercase">
												{person.name.slice(0, 2)}
											</Avatar.Fallback>
										</Avatar.Root>
										<div>
											<div class="font-bold">{person.name}</div>
											<div class="text-sm text-muted-foreground">{person.email}</div>
										</div>
									</div>
								</Table.Cell>
								<Table.Cell>{person.role}</Table.Cell>
								<Table.Cell>{person.onboardingStatus}</Table.Cell>
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
												on:click={() =>
													updateUserRole(person.id, person.role === 'Admin' ? 'User' : 'Admin')}
											>
												{person.role === 'Admin' ? 'Demote to User' : 'Promote to Admin'}
											</DropdownMenu.Item>
											{#if person.onboardingStatus === 'pending'}
												<DropdownMenu.Item on:click={() => resendOnboardingEmail(person.email)}>
													Resend Onboarding Email
												</DropdownMenu.Item>
											{:else if person.onboardingStatus === 'Not Invited'}
												<DropdownMenu.Item on:click={generateOnboardingUrl}>
													Generate Onboarding URL
												</DropdownMenu.Item>
											{/if}
											<DropdownMenu.Separator />
											<DropdownMenu.Item
												on:click={() => removeUser(person.id)}
												class="text-red-600"
											>
												Remove User
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

		<Card.Root>
			<Card.Header>
				<Card.Title>Organization Settings</Card.Title>
			</Card.Header>
			<Card.Content>
				<form on:submit|preventDefault={updateOrganizationName}>
					<Label for="org-name">Organization Name</Label>
					<div class="mt-2 flex gap-2">
						<Input id="org-name" bind:value={organizationName} class="mb-4" />
						<Button type="submit">Update</Button>
					</div>
				</form>
				<div class="mt-6 space-y-4">
					<div class="flex items-center justify-between">
						<div>
							<Label>Notification Emails</Label>
							<p class="text-sm text-muted-foreground">
								Receive email notifications for activity in your organization
							</p>
						</div>
						<Switch.Root
							checked={organizationSettings.notificationEmails}
							on:click={() => toggleSetting('notificationEmails')}
						/>
					</div>
					<div class="flex items-center justify-between">
						<div>
							<Label>Public Profile</Label>
							<p class="text-sm text-muted-foreground">
								Allow your organization profile to be publicly visible
							</p>
						</div>
						<Switch.Root
							checked={organizationSettings.publicProfile}
							on:click={() => toggleSetting('publicProfile')}
						/>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Production Systems</Card.Title>
			</Card.Header>
			<Card.Content>
				<form on:submit|preventDefault={addVisionSystem} class="mb-4">
					<Label for="system-name">New Vision System</Label>
					<div class="mt-2 flex gap-2">
						<Input id="system-name" placeholder="Enter system name" bind:value={newSystemName} />
						<Button type="submit">Add System</Button>
					</div>
				</form>
				{#if $visionSystems.length > 0}
					<Table.Root>
						<Table.Caption>Existing Vision Systems</Table.Caption>
						<Table.Header>
							<Table.Row>
								<Table.Head>System Name</Table.Head>
								<Table.Head class="text-right">Actions</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each $visionSystems as system}
								<Table.Row>
									<Table.Cell>{system}</Table.Cell>
									<Table.Cell class="text-right">
										<Button
											variant="destructive"
											size="sm"
											on:click={() => removeVisionSystem(system)}
										>
											Remove
										</Button>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				{:else}
					<p class="mt-4 text-center text-muted-foreground">No vision systems added yet.</p>
				{/if}
			</Card.Content>
		</Card.Root>
		<!--Bottom Padding-->
		<main class="p-2">
			<slot></slot>
		</main>
	</div>

	<!-- Superadmin settings -->
	<h1 class="mb-6 text-3xl font-bold">Superadmin Settings</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<Card.Root class="col-span-1 md:col-span-2">
			<Card.Header>
				<Card.Title>Organization Management</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="mb-6">
					<Label for="new-organization">Add New Organization</Label>
					<div class="flex gap-2">
						<Input placeholder="Enter organization name" bind:value={newOrganization} />
						<Button type="submit" on:click={addOrganization}>Add Organization</Button>
					</div>
				</div>

				<Table.Root>
					<Table.Caption>List of Organizations</Table.Caption>
					<Table.Header>
						<Table.Row>
							<Table.Head class="w-[300px]">ID</Table.Head>
							<Table.Head>Name</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each organizations as organization}
							<Table.Row>
								<Table.Cell>{organization.id}</Table.Cell>
								<Table.Cell>{organization.name}</Table.Cell>
								<Table.Cell class="text-right">
									<Button
										variant="outline"
										size="sm"
										on:click={() => editOrganization(organization.name)}
									>
										Edit
									</Button>
								</Table.Cell>
								<Table.Cell class="text-right w-[80px]">
									<Button
										variant="destructive"
										size="sm"
										on:click={() => removeOrganization(organization.name)}
									>
										Remove
									</Button>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>

		<Card.Root class="col-span-1 md:col-span-2">
			<Card.Header>
				<Card.Title>Vision System Spare Parts</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="mb-6">
					<Label for="new-organization">Add New Spare Part</Label>
					<div class="flex gap-2">
						<Input placeholder="Enter organization name" bind:value={newOrganization} />
						<Button type="submit" on:click={addOrganization}>Add Organization</Button>
					</div>
				</div>

				<Table.Root>
					<Table.Caption>List of Spare Parts</Table.Caption>
					<Table.Header>
						<Table.Row>
							<Table.Head class="w-[300px]">Number</Table.Head>
							<Table.Head>Name</Table.Head>
							<Table.Head>Image</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each parts as part, partIndex}
							<!-- <Table.Row>
								<Table.Cell>{part.number}</Table.Cell>
								<Table.Cell>{part.name}</Table.Cell>
								<Table.Cell>{part.image}</Table.Cell>
								<Table.Cell class="text-right">
									<Button
										variant="outline"
										size="sm"
										on:click={() => editOrganization(organization.name)}
									>
										Edit
									</Button>
								</Table.Cell>
								<Table.Cell class="text-right w-[80px]">
									<Button
										variant="destructive"
										size="sm"
										on:click={() => removeOrganization(organization.name)}
									>
										Remove
									</Button>
								</Table.Cell>
							</Table.Row> -->
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>

		<Card.Root class="col-span-1 md:col-span-2">
			<Card.Header>
				<Card.Title>Model Management</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="mb-6">
					<Label for="new-model">Add New Model</Label>
					<div class="flex gap-2">
						<Input placeholder="Enter model name" bind:value={newModelName} />
						<Button type="submit" on:click={addModel}>Add Model</Button>
					</div>
				</div>

				<Table.Root>
					<Table.Caption>List of Models</Table.Caption>
					<Table.Header>
						<Table.Row>
							<Table.Head class="w-[300px]">Name</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each models as model, modelIndex}
							<Table.Row>
								<Table.Cell>{model.name}</Table.Cell>
								<Table.Cell class="text-right">
									<Button
										variant="outline"
										size="sm"
										on:click={() => toggleModel(modelIndex)}
									>
										{selectedModel === modelIndex ? 'Hide Parts' : 'Show Parts'}
									</Button>
								</Table.Cell>
								<Table.Cell class="text-right w-[80px]">
									<Button
										variant="destructive"
										size="sm"
										on:click={() => removeModel(modelIndex)}
									>
										Remove
									</Button>
								</Table.Cell>
							</Table.Row>

							<!-- Parts List (Visible when model is selected) -->
							{#if selectedModel === modelIndex}
								<Table.Row>
									<Table.Cell>
										<div class="pl-6">
										<!-- Parts List -->
											<Table.Head>
												<Table.Row>
													<Table.Cell>Part Name</Table.Cell>
												</Table.Row>
											</Table.Head>
											<Table.Body>
												{#each model.parts as part, partIndex}
													<Table.Row>
													<Table.Cell>{part}</Table.Cell>
													<Table.Cell class="text-right w-[80px]">
														<Button
														variant="destructive"
														size="sm"
														on:click={() => removePartFromModel(modelIndex, partIndex)}
														>
														Remove
														</Button>
													</Table.Cell>
													</Table.Row>
												{/each}
											</Table.Body>

										<div class="mt-4 flex items-center space-x-4">
											<input
												type="text"
												placeholder="New part name"
												bind:value={newPartName}
												class="input"
											/>
											<Button on:click={() => addPartToModel(modelIndex)}>
												Add Part
											</Button>
										</div>
									</Table.Cell>
								</Table.Row>
							{/if}
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</div>
</div>
