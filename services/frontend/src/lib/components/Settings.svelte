<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Settings from 'lucide-svelte/icons/settings';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { userStore } from '@/stores/user.svelte';

	let pathname = $derived(page.url.pathname);
	let lastPathname = $derived(page.url.pathname.split('/').filter(Boolean).at(-1));
	let showSystem = $derived(page.params.systemId === lastPathname);
	let showOrganization = $derived(
		page.params.organizationId === lastPathname &&
			(userStore.userRelation?.role === 'Admin' || userStore.isAdmin)
	);

	function handleSettingsClick() {
		// Construct the settings URL based on current pathname
		const settingsUrl = `${pathname}/settings`;
		// Use programmatic navigation
		goto(settingsUrl, {
			// Ensure we get fresh data
			invalidateAll: true,
			// Prevent default anchor behavior
			replaceState: false
		});
	}
</script>

{#if lastPathname}
	{#if showSystem || showOrganization}
		<Button
			onclick={handleSettingsClick}
			variant="outline"
			size="icon"
			class="ml-auto h-9 w-9 bg-background"
		>
			<Settings class="h-4 w-4" />
			<span class="sr-only">Settings</span>
		</Button>
	{/if}
{/if}
