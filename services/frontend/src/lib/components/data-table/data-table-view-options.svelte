<script lang="ts" module>
	type TData = unknown;
</script>

<script lang="ts" generics="TData">
	import Settings2 from 'lucide-svelte/icons/settings-2';
	import type { Table } from '@tanstack/table-core';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	let { table }: { table: Table<TData> } = $props();

	let columns = $derived(
		table.getAllColumns().filter((col) => typeof col.accessorFn !== 'undefined' && col.getCanHide())
	);
</script>

{#if columns.length !== 0}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class={buttonVariants({
				variant: 'outline',
				size: 'sm',
				class: 'ml-auto h-8'
			})}
		>
			<Settings2 />
			View
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading>Toggle columns</DropdownMenu.GroupHeading>
				<DropdownMenu.Separator />
				{#each columns as column}
					<DropdownMenu.CheckboxItem
						checked={column.getIsVisible()}
						onCheckedChange={(v) => column.toggleVisibility(!!v)}
						class="capitalize"
					>
						{column.id}
					</DropdownMenu.CheckboxItem>
				{/each}
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
