<script lang="ts">
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';

	$: lowerPathname = $page.url.pathname.split('/').filter(Boolean);
	$: backUrl = '/' + lowerPathname.slice(0, -1).join('/');
	$: previousSection = lowerPathname.at(-2) || '';
</script>

{#if lowerPathname.length > 1}
	
	<Button href={backUrl} variant="ghost" class="inline-flex md:hidden -ml-4">
		<ArrowLeft class="mr-2 h-4 w-4" />
		Back to
		<span class="ml-1 capitalize">{previousSection}</span>
	</Button>
	
{/if}
<div class="py-4 md:container">
	<slot />
</div>
