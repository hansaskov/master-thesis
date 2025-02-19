<script lang="ts">
	import DataTable from './(components)/data-table.svelte';
	import { columns } from './(components)/columns';
	import { partsStore } from '$lib/stores/parts.svelte';

	partsStore.refresh();
</script>

<div class="h-full flex-1 flex-col space-y-8 p-8 md:flex">
	<div class="flex items-center justify-between space-y-2">
		<div>
			<h2 class="text-2xl font-bold tracking-tight">Welcome back!</h2>
			<p class="text-muted-foreground">Here's a list of your tasks for this month!</p>
		</div>
	</div>
	<DataTable data={partsStore.parts} {columns} />
</div>
