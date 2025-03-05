<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	// import {
	// 	Table,
	// 	TableBody,
	// 	TableCell,
	// 	TableHead,
	// 	TableHeader,
	// 	TableRow
	// } from '$lib/components/ui/table';
	// import { metricGroups } from './monitoringData.svelte';
	// import { Button } from '@/components/ui/button';
	// import RotateCcw from 'lucide-svelte/icons/rotate-ccw';
	import { Area, AreaChart, LinearGradient } from 'layerchart';
	import TimeRangeSelector from '../TimeRangeSelector.svelte';
	import { api } from '@/api';
	import { page } from '$app/state';
	import { timeRangeStore } from '../TimeRangeStore.svelte';
	import { getLocalTimeZone } from '@internationalized/date';
	import { onError } from '@/error';

	let renderContext: 'svg' | 'canvas' = 'svg';
	let debug = false;

	type ChartDate = {
		data: { date: Date; value: number }[];
		title: string;
		description: string;
	}[];

	// API data types
	type OriginalData = NonNullable<Awaited<ReturnType<typeof api.readings.get>>['data']>;

	type Reading = { time: Date; value: number; unit: string };
	type Readings = Record<string, Reading[]>;

	// Helper function to transform API data into grouped readings
	function groupReadings(originalData: OriginalData): Readings {
		const result: Readings = {};

		originalData.forEach((item) => {
			const { time, name, value, unit } = item;

			if (!result[name]) {
				result[name] = [];
			}

			result[name].push({ time, value, unit });
		});

		return result;
	}

	let chartsData = $state<ChartDate>([]);

	async function fetchReadings() {
		const systemId = page.params.systemId;
		const start = timeRangeStore.range.start;
		const end = timeRangeStore.range.end;

		if (!systemId || !start || !end) {
			return;
		}

		const { data, error } = await api.readings.get({
			query: {
				system_id: systemId,
				start: start.toDate(getLocalTimeZone()).toISOString(),
				end: end.toDate(getLocalTimeZone()).toISOString(),
				limit: 100
			}
		});

		if (error) {
			onError(error);
			return;
		}

		const formattedData = groupReadings(data);
		const newChartsData: ChartDate = [];

		for (const [name, readings] of Object.entries(formattedData)) {
			const data: ChartDate[number]['data'] = readings.map((reading) => {
				return {
					date: new Date(reading.time),
					value: reading.value
				};
			});

			newChartsData.push({
				data,
				description: name,
				title: name
			});
		}

		chartsData = newChartsData;
	}

	$inspect(chartsData);

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
</script>

<!-- Charts Section -->

<div class="mb-8">
	<!-- Button to fetch data no longer needed  -->
	<!-- <Button variant="outline" size="icon" onclick={fetchReadings}>
		<RotateCcw />
	</Button> -->
	<div class="mb-4 flex flex-col md:flex-row justify-between md:items-center">
		<h2 class="text-2xl font-bold">Charts</h2>

		<TimeRangeSelector></TimeRangeSelector>
	</div>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each chartsData as { data, title }}
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-xl font-bold">{title}</Card.Title>
				</Card.Header>
				<Card.Content class="h-64">
					<AreaChart {data} x="date" y="value" {renderContext} {debug}>
						<svelte:fragment slot="marks">
							<LinearGradient class="from-primary/50 to-primary/0" vertical let:gradient>
								<Area line={{ class: 'stroke-primary' }} fill={gradient} />
							</LinearGradient>
						</svelte:fragment>
					</AreaChart>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</div>
<!-- Metrics Section -->
<div>
	<h2 class="mb-4 text-2xl font-bold">Metrics</h2>
	Coming Soon!
	<!-- <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each metricGroups as group}
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<group.icon class="h-4 w-4" />
						<span>{group.title}</span>
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead class="text-left">Metric</TableHead>
								<TableHead class="text-right">Value</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{#each group.metrics as metric}
								<TableRow>
									<TableCell class="text-left text-sm">{metric.name}</TableCell>
									<TableCell class="text-right text-sm">{metric.value} {metric.unit}</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					</Table>
				</Card.Content>
			</Card.Root>
		{/each}
	</div> -->
</div>
