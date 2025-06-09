<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import AlertDialogBody from '$lib/components/AlertDialogBody.svelte';
	import ExternalLink from 'lucide-svelte/icons/external-link';
	import { userStore } from '$lib/stores/user.svelte';
	import { organizationStore } from '$lib/stores/organization.svelte';
	import { dialogStore } from '$lib/stores/dialog.svelte';
	import { goto } from '$app/navigation';
	import Pen from 'lucide-svelte/icons/pen';
	import EditUserDialogBody from '@/components/EditUserDialogBody.svelte';
	import EditUserMailDialogBody from '@/components/EditUserMailDialogBody.svelte';
	import { onError } from '@/error';
	import { api } from '$lib/api';

	// Mock user data (in a real app, this would come from an API or store)
	// let user = {
	// 	name: 'Jane Doe',
	// 	email: 'jane.doe@example.com',
	// 	avatar: 'https://i.pravatar.cc/150?u=jane',
	// 	role: 'Software Engineer',
	// 	company: 'TechCorp Inc.'
	// };

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

	// User preferences
	// let preferences = $state({
	// 	emailNotifications: {
	// 		updates: true,
	// 		newsletters: false,
	// 		promotions: false
	// 	},
	// 	theme: 'system'
	// });

	// Available themes
	// const themes = [
	// 	{ value: 'light', label: 'Light' },
	// 	{ value: 'dark', label: 'Dark' },
	// 	{ value: 'system', label: 'System' }
	// ];

	// function updatePreferences() {
	// 	// In a real app, this would send the updated preferences to an API
	// 	console.log('Preferences updated:', preferences);
	// 	alert('Preferences updated successfully!');
	// }

	async function deleteUser() {
		await userStore.deleteUser();
		goto('/login');
	}

	function editName() {
		if (!userStore.user) return;
		dialogStore.open({
			title: `Update ${userStore.user?.name}`,
			description: 'This action will update your displayed name',
			component: EditUserDialogBody,
			props: userStore.user
		});
	}

	function editMail() {
		if (!userStore.user) return;
		dialogStore.open({
			title: `Update ${userStore.user?.email}`,
			description: 'This action will update your email',
			component: EditUserMailDialogBody,
			props: userStore.user
		});
	}

	let fileInput: HTMLInputElement;

	// function openFilePicker() {
	// 	fileInput.click();
	// }

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
</script>

<div class="container mx-auto px-4 py-8">
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

		<!-- <Card.Root>
			<Card.Header>
				<Card.Title>Account Preferences</Card.Title>
				<Card.Description>Customize your account settings and notifications.</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="space-y-4">
					<div>
						<Label for="theme" class="text-sm font-medium">Theme</Label>
						<Select.Root type="single">
							<Select.Trigger id="theme" class="w-full" placeholder="Select a theme"
							></Select.Trigger>
							<Select.Content>
								{#each themes as theme}
									<Select.Item value={theme.value}>{theme.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>
					<div class="space-y-4">
						<h3 class="text-base font-semibold">Email Notifications</h3>
						<div class="flex items-center justify-between">
							<Label for="updates" class="text-sm">Product Updates</Label>
							<Switch.Root
								id="updates"
								checked={preferences.emailNotifications.updates}
								onCheckedChange={(checked) => (preferences.emailNotifications.updates = checked)}
							/>
						</div>
						<div class="flex items-center justify-between">
							<Label for="newsletters" class="text-sm">Newsletters</Label>
							<Switch.Root
								id="newsletters"
								checked={preferences.emailNotifications.newsletters}
								onCheckedChange={(checked) =>
									(preferences.emailNotifications.newsletters = checked)}
							/>
						</div>
						<div class="flex items-center justify-between">
							<Label for="promotions" class="text-sm">Promotions and Offers</Label>
							<Switch.Root
								id="promotions"
								checked={preferences.emailNotifications.promotions}
								onCheckedChange={(checked) => (preferences.emailNotifications.promotions = checked)}
							/>
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root> -->

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

	<!-- <div class="mt-8 flex justify-end">
		<Button onclick={updatePreferences}>Save Changes</Button>
	</div> -->
</div>
