<script lang="ts">
	import { type Icon as IconType } from 'lucide-svelte';
	type Select = {
		value: string;
		label: string;
		icon: typeof IconType;
	};
	let { value, choices }: { value?: string; choices: Select[] } = $props();
	const choice = $derived(choices.find((choice) => choice.value === value));
	const Icon = $derived(choice?.icon);
</script>

{#if choice}
	<div class="flex items-center">
		{#if Icon}
			<Icon class="text-muted-foreground mr-2 size-4" />
		{/if}
		<span>{choice.label}</span>
	</div>
{/if}
