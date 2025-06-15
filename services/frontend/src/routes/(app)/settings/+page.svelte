<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import AlertDialogBody from '$lib/components/AlertDialogBody.svelte';
	import ExternalLink from 'lucide-svelte/icons/external-link';
	import { userStore } from '$lib/stores/user.svelte';
	import { dialogStore } from '$lib/stores/dialog.svelte';
	import { goto } from '$app/navigation';
	import { onError } from '@/error';
	import { api } from '$lib/api';
	import { Input } from '$lib/components/ui/input';
	import type { Types } from 'backend';
	import Download from 'lucide-svelte/icons/download';
	import { Trash2 } from 'lucide-svelte';

	// Mock user data (in a real app, this would come from an API or store)
	// let user = {
	// 	name: 'Jane Doe',
	// 	email: 'jane.doe@example.com',
	// 	avatar: 'https://i.pravatar.cc/150?u=jane',
	// 	role: 'Software Engineer',
	// 	company: 'TechCorp Inc.'
	// };
	let isEditing = $state(false);

	let formData = $state<Types.UserUpdate>({
		id: userStore.user?.id ?? '',
		name: userStore.user?.name,
		provider_name: 'Microsoft',
		provider_id: userStore.user?.provider_id,
		email: userStore.user?.email,
		image: userStore.user?.image
	});

	// Download user data
	// Helper function to trigger the download
	function triggerDownload(blob: Blob, filename: string) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');

		a.href = url;
		a.download = filename;

		// Append <a> to <body>, click it, and then remove it
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);

		// Revoke the object URL to free up resources
		URL.revokeObjectURL(url);
	}

	async function downloadData() {
		console.log('downloadData() was called');
		const allData = await userStore.getAllUserData();
		if (!allData) {
			return;
		}

		const csvRows: string[] = [];
		csvRows.push('section,field,value');

		if (allData.user) {
			for (const [field, value] of Object.entries(allData.user)) {
				// Convert `null` → empty string, booleans → string, etc.
				const v = value == null ? '' : String(value);
				csvRows.push(`user,${field},${v}`);
			}
		} else {
			csvRows.push('user,ERROR,No user row found');
		}

		// Blank line between sections
		csvRows.push('');

		// === 2) “sessions” section ===
		if (allData.sessions.length > 0) {
			csvRows.push('session_id,user_id,expires_at');
			for (const sess of allData.sessions) {
				const expires = sess.expires_at == null ? '' : String(sess.expires_at);
				csvRows.push(`${sess.id},${sess.user_id},${expires}`);
			}
			csvRows.push('');
		} else {
			csvRows.push('sessions,INFO,No sessions found');
			csvRows.push('');
		}

		// === 3) “memberships” section ===
		if (allData.memberships.length > 0) {
			// Header line for membership rows:
			csvRows.push('membership_id,organization_id,organization_name,role');
			for (const m of allData.memberships) {
				const orgId = m.organization.id;
				const orgName = m.organization.name?.replaceAll(',', ''); // strip commas so CSV doesn’t break
				const role = m.role;
				csvRows.push(`${m.id},${orgId},${orgName},${role}`);
			}
			csvRows.push('');
		} else {
			csvRows.push('memberships,INFO,No organization memberships found');
			csvRows.push('');
		}

		// === 4) “invites” section ===
		if (allData.invites.length > 0) {
			csvRows.push('invite_id,organization_id,inviter_id,email,is_accepted,expires_at,role');
			for (const inv of allData.invites) {
				const expires = inv.expires_at == null ? '' : String(inv.expires_at);
				csvRows.push(
					`${inv.id},${inv.organization_id},${inv.inviter_id},${inv.email},${inv.is_accepted},${expires},${inv.role}`
				);
			}
		} else {
			csvRows.push('invites,INFO,No invites sent');
		}

		// === 5) Join all rows with newline, make a Blob, and download ===
		const csvString = csvRows.join('\n');
		const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
		triggerDownload(blob, 'my_user_data.csv');
	}

	async function deleteUser() {
		await userStore.deleteUser();
		goto('/login');
	}

	// function editName() {
	// 	if (!userStore.user) return;
	// 	dialogStore.open({
	// 		title: `Update ${userStore.user?.name}`,
	// 		description: 'This action will update your displayed name',
	// 		component: EditUserDialogBody,
	// 		props: userStore.user
	// 	});
	// }

	// function editMail() {
	// 	if (!userStore.user) return;
	// 	dialogStore.open({
	// 		title: `Update ${userStore.user?.email}`,
	// 		description: 'This action will update your email',
	// 		component: EditUserMailDialogBody,
	// 		props: userStore.user
	// 	});
	// }

	let fileInput: HTMLInputElement;

	async function handleFileChange() {
		console.log(fileInput.files);

		function generateRandomString(length: number) {
			const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			let result = '';
			for (let i = 0; i < length; i++) {
				result += characters.charAt(Math.floor(Math.random() * characters.length));
			}
			return result;
		}

		// const images = document.getElementById('file-upload') as HTMLInputElement;
		let image = fileInput.files![0];
		// Get the name as the file
		const originalFileName = image.name.split('\\').pop();
		const extension = originalFileName?.split('.').pop();

		// Generate unique name for database entry
		const uniqueFileName = generateRandomString(12) + '.' + extension;
		console.log(uniqueFileName);

		const { error } = await api.files.index.post({ image: image, title: uniqueFileName });

		if (error) {
			onError(error);
		}

		let id: string | undefined = userStore.user?.id;
		if (id) {
			userStore.editImage(id, uniqueFileName);
		}
	}

	async function updateUser() {
		isEditing = false;
		await userStore.edit(formData);
	}

	async function editProfile() {
		if (isEditing) {
			isEditing = false;
		} else {
			isEditing = true;
		}
	}
</script>

<div class="container mx-auto max-w-4xl p-6 space-y-8">
	<div class="space-y-2">
		<h1 class="text-3xl font-bold tracking-tight">Settings</h1>
		<p class="text-muted-foreground">Manage your account settings and preferences.</p>
	</div>

	<Card.Root>
		<Card.Header class="flex flex-row items-center justify-between">
			<div>
				<Card.Title class="flex items-center gap-2">Profile Information</Card.Title>
				<Card.Description>Update your personal information and company details.</Card.Description>
			</div>
			<div class="flex gap-2">
				{#if isEditing}
					<Button onclick={() => updateUser()}>Save Changes</Button>
					<Button variant="outline" onclick={() => editProfile()}>Cancel</Button>
				{:else if !isEditing}
					<Button variant="secondary" onclick={() => editProfile()}>Edit Profile</Button>
				{/if}
			</div>
		</Card.Header>

		<Card.Content class="space-y-6">
			<div class="flex items-center gap-4">
				<Avatar.Root class="h-20 w-20">
					<Avatar.Image src={userStore.user?.image} alt={userStore.user?.name} />
					<Avatar.Fallback class="text-lg">JD</Avatar.Fallback>
				</Avatar.Root>
				<div class="space-y-2">
					<div class="relative inline-block">
						<input
							bind:this={fileInput}
							type="file"
							accept=".jpg,.jpeg,.png,.webp"
							class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
							onchange={handleFileChange}
						/>
						<Button variant="outline" size="sm">Change Photo</Button>
					</div>
					<p class="text-sm text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="firstName">First Name</Label>
					<Input
						id="firstName"
						placeholder="Enter your first name"
						value="Sebastian"
						disabled={!isEditing}
					/>
				</div>
				<div class="space-y-2">
					<Label for="lastName">Last Name</Label>
					<Input
						id="lastName"
						placeholder="Enter your last name"
						bind:value={formData.name}
						disabled={!isEditing}
					/>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Data Management</Card.Title>
			<Card.Description>Manage your personal data and account preferences.</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div class="flex items-center justify-between p-4 border rounded-lg">
				<div class="space-y-1">
					<h4 class="font-medium">Request Your Data</h4>
					<p class="text-sm text-muted-foreground">
						Download a copy of all your personal data stored in our system.
					</p>
				</div>
				<Button variant="outline" onclick={() => downloadData()} class="flex items-center gap-2">
					<Download class="h-4 w-4" />
					Request Data
				</Button>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title class="text-destructive">Danger Zone</Card.Title>
			<Card.Description>Irreversible and destructive actions.</Card.Description>
		</Card.Header>
		<Card.Content>
			<div
				class="flex items-center justify-between p-4 border border-destructive rounded-lg bg-destructive/5"
			>
				<div class="space-y-1">
					<h4 class="font-medium text-destructive">Delete Account</h4>
					<p class="text-sm text-muted-foreground">
						Permanently delete your account and all associated data. Contact your organization admin
						if you regret this choice.
					</p>
				</div>
				<Button
					variant="destructive"
					class="flex items-center gap-2"
					onclick={() =>
						dialogStore.open({
							title: 'Are you absolutely sure?',
							description: 'This action cannot be undone',
							component: AlertDialogBody,
							props: { onsubmit: () => deleteUser() }
						})}
				>
					<Trash2 class="h-4 w-4" />
					Delete Your Account
					<ExternalLink class="h-4 w-4" />
				</Button>
			</div></Card.Content
		>
	</Card.Root>
</div>
<!-- <div class="container mx-auto px-4 py-8">
	<h1 class="mb-6 text-3xl font-bold">User Settings</h1>

	<div class="grid gap-6">
		<Card.Root class="md:col-span-1">
			<Card.Header>
				<Card.Title>Personal Information</Card.Title>
				<Card.Description>Manage your personal information</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="flex gap-4 flex-col md:flex-row md:items-center md:space-x-8">
					<div class="flex items-center space-x-4">
						<Avatar.Root class="h-16 w-16 md:h-24 md:w-24">
							<Avatar.Image src={userStore.user?.image} alt={userStore.user?.name} />
							<Avatar.Fallback class="text-2xl">
								{userStore.user?.name.slice(0, 2).toUpperCase()}
							</Avatar.Fallback>
							<input
								bind:this={fileInput}
								type="file"
								accept=".jpg,.jpeg,.png,.webp"
								class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
								onchange={handleFileChange}
							/>
						</Avatar.Root>
						<div>
							<p class="text-xl font-semibold">
								{userStore.user?.name}
								<Button onclick={() => editName()} aria-label="Edit name">
									<Pen />
								</Button>
							</p>

							<p class="text-muted-foreground text-lg">Software Engineer</p>
						</div>
					</div>
					<div>
						<Label for="email" class="text-base font-medium">
							Email Address
							<Button onclick={() => editMail()} aria-label="Edit mail">
								<Pen />
							</Button>
						</Label>
						<p id="email" class="mt-1 text-sm">{userStore.user?.email}</p>
					</div>
					<div>
						{#if organizationStore.organizations.length > 0}
							<Label for="company" class="text-base font-medium">Company</Label>
							<p id="company" class="mt-1 text-sm">{organizationStore.organizations[0].name}</p>
						{/if}
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Legal Documents</Card.Title>
				<Card.Description>Access our Privacy Policy and Terms of Service.</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="space-y-4">
					<div>
						<Button
							variant="outline"
							class="flex w-full items-center justify-between"
							onclick={() => window.open('/privacy-policy', '_blank')}
						>
							Privacy Policy
							<ExternalLink class="h-4 w-4" />
						</Button>
					</div>
					<div>
						<Button
							variant="outline"
							class="flex w-full items-center justify-between"
							onclick={() => window.open('/terms-of-service', '_blank')}
						>
							Terms of Service
							<ExternalLink class="h-4 w-4" />
						</Button>
					</div>
					<div>
						<Button
							variant="outline"
							class="flex w-full items-center justify-between"
							onclick={() => downloadData()}
						>
							Download Your Information
							<ExternalLink class="h-4 w-4" />
						</Button>
					</div>
					<div>
						<Button
							variant="outline"
							class="flex w-full items-center justify-between"
							onclick={() =>
								dialogStore.open({
									title: 'Are you absolutely sure?',
									description: 'This action cannot be undone',
									component: AlertDialogBody,
									props: { onsubmit: () => deleteUser() }
								})}
						>
							Delete Your Account
							<ExternalLink class="h-4 w-4" />
						</Button>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<div class="mt-8 flex justify-end">
		<Button onclick={updatePreferences}>Save Changes</Button>
	</div>
</div> -->
