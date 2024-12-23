<script lang="ts">
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import { Button } from '$lib/components/ui/button';
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';

	let { children }: { children?: Snippet } = $props();

	let canGoBack = $state(false);
	let previousSection = $derived(page.url.pathname.split('/').pop());

	$effect.pre(() => {
		canGoBack = window.history.length > 1;
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
	<span class="ml-1 capitalize">{previousSection}</span>
</Button>

<div class="py-4 md:container">
	{@render children?.()}
</div>
