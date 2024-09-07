<script lang="ts">
	import { page } from '$app/stores';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import type { Icon } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';

    export let props: {
        name: string,
	    href: string,
	    icon: ComponentType<Icon>
    }

    const {name, icon, href } = props

    $: isActive = $page.url.pathname.startsWith(href);

</script>

<Tooltip.Root>
	<Tooltip.Trigger asChild>
		<a
		    {href}
			class={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground md:h-8 md:w-8 ${isActive ? "text-foreground": "text-muted-foreground hover:text-foreground" }`}
            class:active={isActive}
		>
			<svelte:component this={icon} class="h-5 w-5" />
			<span class="sr-only">{name}</span>
		</a>
	</Tooltip.Trigger>
	<Tooltip.Content side="right">{name}</Tooltip.Content>
</Tooltip.Root>
