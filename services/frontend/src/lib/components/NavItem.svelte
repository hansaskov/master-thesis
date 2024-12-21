<!-- @migration-task Error while migrating Svelte code: migrating this component would require adding a `$props` rune but there's already a variable named props.
     Rename the variable and try again or migrate by hand. -->
<script lang="ts">
	import { page } from '$app/state';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import type { Icon as IconType } from 'lucide-svelte';

	let { name, icon, href } : {
		name: string;
		href: string;
		icon: typeof IconType;
	} = $props();


	let isActive = $state(page.url.pathname.startsWith(href));
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		{@const Icon = icon}
		<a
			{href}
			class={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground md:h-8 md:w-8 ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
			class:active={isActive}
		>
			<Icon  class="h-5 w-5" ></Icon>
			<span class="sr-only">{name}</span>
		</a>
	</Tooltip.Trigger>
	<Tooltip.Content side="right">{name}</Tooltip.Content>
</Tooltip.Root>
