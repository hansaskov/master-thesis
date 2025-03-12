<script lang="ts">
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import { Button } from '$lib/components/ui/button';
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { systemStore } from '@/stores/systems.svelte';

	let { children }: { children?: Snippet } = $props();

	let canGoBack = $state(false);
	let pageName = $derived(page.url.pathname);
	let previousSectionDisplay = $state('');

	$effect.pre(() => {
		canGoBack = window.history.length > 1;

		const pathSegments = pageName.split('/').filter((segment) => segment.length > 0);
		if (pathSegments.length >= 2) {
			// Get the second-to-last segment, which might be a system ID
			const potentialSystemId = pathSegments[pathSegments.length - 2];

			// Check if this segment matches any system ID
			const matchingSystem = systemStore.systems.find((system) => system.id === potentialSystemId);
			console.log('found matching system');

			if (matchingSystem) {
				// We found a matching system - use its name
				previousSectionDisplay = matchingSystem.name;
			} else {
				// No matching system - use the segment as is
				previousSectionDisplay = potentialSystemId || '';
			}
		} else {
			// Case where there aren't enough segments
			previousSectionDisplay = '';
		}
	});

	function handleGoBack() {
		if (canGoBack) {
			history.back();
		} else {
			// For playground testing - just log when we can't go back
			console.log('No history available, would redirect to home');
		}
	}
</script>

<Button onclick={handleGoBack} variant="ghost" class="inline-flex md:hidden -ml-2">
	<ArrowLeft class="mr-2 h-4 w-4" />
	Back to
	<span class="capitalize">{previousSectionDisplay}</span>
</Button>

<div class="py-4 md:container">
	{@render children?.()}
</div>
