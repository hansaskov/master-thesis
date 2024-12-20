<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Settings from 'lucide-svelte/icons/settings';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	$: pathname = $page.url.pathname;
	$: lastPathname = $page.url.pathname.split('/').filter(Boolean).at(-1);
	$: systemId = $page.params.id;

	const whitelist = ['systems'];

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

{#if lastPathname && (whitelist.includes(lastPathname) || lastPathname === systemId)}
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
