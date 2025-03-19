<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { monitorStore } from '@/stores/monitor.svelte';
	import { groupBy } from '@/utils';
</script>

<div>
	<h2 class="mb-4 text-2xl font-bold">Metrics</h2>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each groupBy(monitorStore.latestReadings, 'category') as [category, metrics]}
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<!-- <group.icon class="h-4 w-4" />  -->
						<span class="capitalize">{category}</span>
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head class="text-left">Metric</Table.Head>
								<Table.Head class="text-right">Value</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each metrics as metric}
								<Table.Row>
									<Table.Cell class="text-left text-sm">{metric.name}</Table.Cell>
									<Table.Cell class="text-right text-sm"
										>{metric.value.toFixed(2)} {metric.unit}</Table.Cell
									>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</div>
