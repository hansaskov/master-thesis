<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import * as Switch from '$lib/components/ui/switch';
	import * as Select from '$lib/components/ui/select';
	import * as Avatar from '$lib/components/ui/avatar';
	import { ExternalLink } from 'lucide-svelte';

	// Mock user data (in a real app, this would come from an API or store)
	let user = {
		name: 'Jane Doe',
		email: 'jane.doe@example.com',
		avatar: 'https://i.pravatar.cc/150?u=jane',
		role: 'Software Engineer',
		company: 'TechCorp Inc.'
	};

	// User preferences
	let preferences = {
		emailNotifications: {
			updates: true,
			newsletters: false,
			promotions: false
		},
		theme: 'system'
	};

	// Available themes
	const themes = [
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' },
		{ value: 'system', label: 'System' }
	];

	function updatePreferences() {
		// In a real app, this would send the updated preferences to an API
		console.log('Preferences updated:', preferences);
		alert('Preferences updated successfully!');
	}
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-6 text-3xl font-bold">User Settings</h1>

	<div class="grid gap-6">
		<Card.Root class="md:col-span-1">
			<Card.Header>
				<Card.Title>Personal Information</Card.Title>
				<Card.Description>
					Your personal information is managed by {user.company}. Contact your administrator for
					changes.
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="flex gap-4 flex-col md:flex-row md:items-center md:space-x-8">
					<div class="flex items-center space-x-4">
						<Avatar.Root class="h-16 w-16 md:h-24 md:w-24">
							<Avatar.Image src={user.avatar} alt={user.name} />
							<Avatar.Fallback class="text-2xl">
								{user.name.slice(0, 2).toUpperCase()}
							</Avatar.Fallback>
						</Avatar.Root>
						<div>
							<p class="text-xl font-semibold">{user.name}</p>
							<p class="text-muted-foreground text-lg">{user.role}</p>
						</div>
					</div>
						<div>
							<Label for="email" class="text-base font-medium">Email Address</Label>
							<p id="email" class="mt-1 text-sm">{user.email}</p>
						</div>
						<div>
							<Label for="company" class="text-base font-medium">Company</Label>
							<p id="company" class="mt-1 text-sm ">{user.company}</p>
						</div>

				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Account Preferences</Card.Title>
				<Card.Description>Customize your account settings and notifications.</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="space-y-4">
					<div>
						<Label for="theme" class="text-sm font-medium">Theme</Label>
						<Select.Root>
							<Select.Trigger id="theme" class="w-full">
								<Select.Value placeholder="Select a theme" />
							</Select.Trigger>
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
							on:click={() => window.open('/privacy-policy', '_blank')}
						>
							Privacy Policy
							<ExternalLink class="h-4 w-4" />
						</Button>
					</div>
					<div>
						<Button
							variant="outline"
							class="flex w-full items-center justify-between"
							on:click={() => window.open('/terms-of-service', '_blank')}
						>
							Terms of Service
							<ExternalLink class="h-4 w-4" />
						</Button>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<div class="mt-8 flex justify-end">
		<Button on:click={updatePreferences}>Save Changes</Button>
	</div>
</div>
