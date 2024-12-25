<script lang="ts">
	import { page } from '$app/state';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import type { Snippet } from 'svelte';

	let {
		name,
		children,
		href
	}: {
		name: string;
		href: string;
		children: Snippet;
	} = $props();

	let isActive = $state(page.url.pathname.startsWith(href));
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<a
			{href}
			class={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground md:h-8 md:w-8 ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
			class:active={isActive}
		>
			{@render children()}
			<span class="sr-only">{name}</span>
		</a>
	</Tooltip.Trigger>
	<Tooltip.Content side="right">{name}</Tooltip.Content>
</Tooltip.Root>
