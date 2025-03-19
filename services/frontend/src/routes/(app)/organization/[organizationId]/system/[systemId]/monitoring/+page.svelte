<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import { Area, AreaChart, LinearGradient, Tooltip } from 'layerchart';
	import TimeRangeSelector from '../TimeRangeSelector.svelte';

	import { timeRangeStore } from '../TimeRangeStore.svelte';
	import { DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import Metrics from './Metrics.svelte';
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

	async function fetchReadings() {
		const { start, end } = timeRangeStore.range;

		if (!start || !end) {
			console.warn('fetchReadings returned early');
			return;
		}

		monitorStore.refresh({
			start: start.toDate(getLocalTimeZone()).toISOString(),
			end: end.toDate(getLocalTimeZone()).toISOString(),
			limit: 3600
		});
	}

	// Add a reactive statement to fetch readings when time range changes
	$effect(() => {
		// Get the values that should trigger a refresh
		const start = timeRangeStore.range?.start;
		const end = timeRangeStore.range?.end;

		// If we have valid start and end dates, fetch readings
		if (start && end) {
			fetchReadings();
		}
	});

	// Initial fetch on mount
	onMount(() => {
		fetchReadings();
	});

	const df = new DateFormatter('en-US', { timeStyle: 'medium' });
</script>

<!-- Charts Section -->

<div class="mb-8">
	<div class="mb-4 flex flex-col md:flex-row justify-between md:items-center">
		<h2 class="text-2xl font-bold">Charts</h2>

		<TimeRangeSelector></TimeRangeSelector>
	</div>

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
</div>
<!-- Metrics Section -->
<Metrics />
