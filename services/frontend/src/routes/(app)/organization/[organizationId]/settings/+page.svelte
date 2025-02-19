<script lang="ts">
	import OrganizationSettings from './OrganizationSettings.svelte';
	import UserSettings from './UserSettings.svelte';
	import ProductionSettings from './ProductionSettings.svelte';
	import { userStore } from '@/stores/user.svelte';

	userStore.refresh();
</script>

<div class="container mx-auto px-4 py-4">
	<h1 class="mb-6 text-3xl font-bold">Settings</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<UserSettings />
		<OrganizationSettings />
		{#if userStore.isAdmin}
			<ProductionSettings />
		{/if}
	</div>
</div>
