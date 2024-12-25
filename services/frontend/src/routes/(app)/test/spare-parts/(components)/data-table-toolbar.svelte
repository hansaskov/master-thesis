<script lang="ts" module>
	type TData = unknown;
</script>

<script lang="ts" generics="TData">
	import X from 'lucide-svelte/icons/x';
	import type { Table } from '@tanstack/table-core';
	import { DataTableViewOptions } from './index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input/index.js';

	let { table, searchColumn }: { table: Table<TData>, searchColumn?: string } = $props();


	const isFiltered = $derived(table.getState().columnFilters.length > 0);
</script>

<div class="flex items-center justify-between">
	<div class="flex flex-1 items-center space-x-2">
		{#if searchColumn} 
			<Input
				placeholder="Filter tasks..."
				value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''}
				oninput={(e) => {
					table.getColumn(searchColumn)?.setFilterValue(e.currentTarget.value);
				}}
				onchange={(e) => {
					table.getColumn(searchColumn)?.setFilterValue(e.currentTarget.value);
				}}
				class="h-8 w-[150px] lg:w-[250px]"
			/>
		{/if}

		{#if isFiltered}
			<Button variant="ghost" onclick={() => table.resetColumnFilters()} class="h-8 px-2 lg:px-3">
				Reset
				<X />
			</Button>
		{/if}
	</div>
	
	<DataTableViewOptions {table} />
</div>
