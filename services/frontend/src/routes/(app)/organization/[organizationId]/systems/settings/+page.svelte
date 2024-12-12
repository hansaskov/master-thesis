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
	import { systemStore } from '$lib/stores/systems.svelte';

	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import Copy from 'lucide-svelte/icons/copy';
	import AlertCircle from 'lucide-svelte/icons/circle-alert';
	import type { Types } from 'backend';

	let organizationName = 'My Organization';
	let organizationSettings = {
		notificationEmails: true,
		publicProfile: false
	};

	let newSystem = $state<Types.SystemNew>();

	let pathName = window.location.pathname;
	let organizationId = pathName.split('/')[2];

	let users = [
		{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', avatarUrl: '' },
		{ id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', avatarUrl: '' }
	];
	let newUserEmail = '';
	let newSystemName = $state('');
	let visionSystems = writable<string[]>(['System A', 'System B']);
	let generatedOnboardingUrl = '';
	let showOnboardingUrl = false;

	let systemModelId: string | null = null;
	//let organizationId: string = "test-organization-id";

	let onboardingInvitations = [
		{ email: 'pendinguser@example.com', status: 'pending' },
		{ email: 'completeduser@example.com', status: 'completed' }
	];

	const usersAndInvites = users.map((user) => ({
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

	$effect.pre(() => {
		systemStore.selectAll();
	});
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
				<form
					onsubmit={(e) => {
						e.preventDefault();
						updateOrganizationName();
					}}
				>
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
				<form
					onsubmit={(e) => {
						e.preventDefault();
						systemStore.add(newSystem!);
						newSystemName = '';
					}}
					class="mb-4"
				>
					<Label for="system-name">New Vision System</Label>
					<div class="mt-2 flex gap-2">
						<Input id="system-name" placeholder="Enter system name" bind:value={newSystemName} />
						<Button type="submit">Add System</Button>
					</div>
				</form>
				{#if systemStore.systems.length > 0}
					<Table.Root>
						<Table.Caption>Existing Vision Systems</Table.Caption>
						<Table.Header>
							<Table.Row>
								<Table.Head>System Name</Table.Head>
								<Table.Head class="text-right">Actions</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each systemStore.systems as system}
								<Table.Row>
									<Table.Cell>{system.name}</Table.Cell>
									<Table.Cell class="text-right">
										<Button
											variant="destructive"
											size="sm"
											on:click={() => systemStore.delete(system.id)}
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
</div>
