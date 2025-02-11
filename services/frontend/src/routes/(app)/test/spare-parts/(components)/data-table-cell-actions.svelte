<script lang="ts" module>
	type TData = unknown;
</script>

<script lang="ts" generics="TData">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import Button from '$lib/components/ui/button/button.svelte';

	import AlertDialogBody from '$lib/components/AlertDialogBody.svelte';
	import EditPartDialogBody from '$lib/components/EditPartDialogBody.svelte';

	import type { Row } from '@tanstack/table-core';
	import { Value } from '@sinclair/typebox/value';
	import { partSchema } from '../(data)/schema';
	import { dialogStore } from '$lib/stores/dialog.svelte';
	import { partsStore } from '$lib/stores/new-parts.svelte';

	let { row }: { row: Row<TData> } = $props();

	const part = Value.Parse(partSchema, row.original);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" class="data-[state=open]:bg-muted flex h-8 w-8 p-0">
				<Ellipsis />
				<span class="sr-only">Open Menu</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Label>Actions</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Item
			onclick={() => {
				dialogStore.open({
					title: `Update ${part.name}`,
					description: 'This action will update the name of the selected organization',
					component: EditPartDialogBody,
					props: part
				});
			}}
		>
			Edit Organization
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item
			onclick={() => {
				dialogStore.open({
					title: 'Are you absolutely sure?',
					description:
						"This action cannot be undone. This will permanently delete the organization and all of it's systems",
					component: AlertDialogBody,
					props: {
						onsubmit: () => {
							console.log(part);
							partsStore.remove(part);
						}
					}
				});
			}}
			class="text-red-600"
		>
			Remove Organization
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
