<script lang="ts">
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';

	let canGoBack = false;
	$: previousSection = $page.url.pathname.split('/').pop();

	$: {
		canGoBack = window.history.length > 1;
	}

	function handleGoBack() {
		if (canGoBack) {
			history.back();
		} else {
			// For playground testing - just log when we can't go back
			console.log('No history available, would redirect to home');
		}
	}
</script>

<Button on:click={handleGoBack} variant="ghost" class="inline-flex md:hidden -ml-2">
	<ArrowLeft class="mr-2 h-4 w-4" />
	Back to
	<span class="ml-1 capitalize">{previousSection}</span>
</Button>

<div class="py-4 md:container">
	<slot />
</div>
