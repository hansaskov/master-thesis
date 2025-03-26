<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Area, AreaChart, LinearGradient, Tooltip } from 'layerchart';
	import { DateFormatter } from '@internationalized/date';
	import { groupBy } from '@/utils';
	import { monitorStore } from '@/stores/monitor.svelte';

	let chartsData = $derived.by(() => {
		return Array.from(groupBy(monitorStore.readings, 'name'), ([name, readings]) => ({
			name,
			data: readings.map(({ time, value }) => ({
				date: new Date(time),
				value
			}))
		}));
	});

	const df = new DateFormatter('en-US', { timeStyle: 'medium' });
</script>

<!-- Charts Section -->

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
	{#each chartsData as { data, name }}
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-xl font-bold">{name}</Card.Title>
			</Card.Header>
			<Card.Content class="h-[300px] p-4 border rounded">
				<AreaChart {data} x="date" y="value">
					<svelte:fragment slot="marks">
						<LinearGradient class="from-primary/50 to-primary/0" vertical let:gradient>
							<Area line={{ class: 'stroke-primary' }} fill={gradient} />
						</LinearGradient>l
					</svelte:fragment>
					<svelte:fragment slot="tooltip">
						<Tooltip.Root let:data>
							<Tooltip.Header>{df.format(data.date)}</Tooltip.Header>
							<Tooltip.List>
								<Tooltip.Item label="value" value={data.value} />
							</Tooltip.List>
						</Tooltip.Root>
					</svelte:fragment>
				</AreaChart>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
