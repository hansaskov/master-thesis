<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Switch from '$lib/components/ui/switch';

	import { organizationStore } from '@/stores/organization.svelte';

	let name = $state(organizationStore.currentOrganization?.name ?? '');
	let notificationEmails = $state(true);
	let publicProfile = $state(false);

	function onsubmit(e: SubmitEvent) {
		e.preventDefault();

		if (organizationStore.currentOrganization) {
			organizationStore.edit({
				name: name,
				id: organizationStore.currentOrganization.id
			});
		}
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Organization Settings</Card.Title>
		<Card.Description>Change the settings for this organization</Card.Description>
	</Card.Header>
	<Card.Content>
		<form {onsubmit}>
			<Label for="org-name">Organization Name</Label>
			<div class="mt-2 flex gap-2">
				<Input id="org-name" bind:value={name} class="mb-4" />
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
					checked={notificationEmails}
					onclick={() => (notificationEmails = !notificationEmails)}
				/>
			</div>
			<div class="flex items-center justify-between">
				<div>
					<Label>Public Profile</Label>
					<p class="text-sm text-muted-foreground">
						Allow your organization profile to be publicly visible
					</p>
				</div>
				<Switch.Root checked={publicProfile} onclick={() => (publicProfile = !publicProfile)} />
			</div>
		</div>
	</Card.Content>
</Card.Root>
