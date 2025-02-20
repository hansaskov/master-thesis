<script lang="ts">
	import OrganizationSettings from './OrganizationSettings.svelte';
	import UserSettings from './UserSettings.svelte';
	import SystemsForm from './SystemsForm.svelte';
	import { userStore } from '@/stores/user.svelte';
	import SystemsList from './SystemsList.svelte';

	userStore.refresh();
</script>

<div class="container mx-auto px-4 py-4">
	<h1 class="mb-6 text-3xl font-bold">Settings</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<UserSettings />
		<OrganizationSettings />
		{#if userStore.isAdmin}
			<SystemsForm />
			<SystemsList />
		{/if}
	</div>
</div>
