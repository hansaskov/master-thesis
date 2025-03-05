<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';

	import { Separator } from '$lib/components/ui/separator/index.js';
	//import AreaChart from '$lib/components/AreaChart.svelte';

	import AvailabilityCard from './AvailabilityCard.svelte';
	import ProductionSpeedCard from './ProductionSpeedCard.svelte';
	import QualityCard from './QualityCard.svelte';

	import Gauge from 'lucide-svelte/icons/gauge';

	import GaugeChart from '$lib/components/GaugeChart.svelte';
	import TimeRangeSelector from '../TimeRangeSelector.svelte';
	//import { timeRangeStore } from '../TimeRangeStore.svelte';

	// function createTimeRange(hours: number): string[] {
	// 	const now = new Date();
	// 	return Array.from({ length: hours }, (_, i) => {
	// 		const time = new Date(now.getTime() - (hours - 1 - i) * 60 * 60 * 1000);
	// 		return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	// 	});
	// }

	// Mock data (replace with actual data in a real application)
	const mockData = {
		oee: 54,
		'good parts': 9750,
		'bad parts': 250,
		uptime: 95,
		downtime: 5,
		'production speed': 420
	};

	const gauges = [
		{ label: 'Performance', value: 75, unit: '%' },
		{ label: 'Quality', value: 90, unit: '%' },
		{ label: 'Availability', value: 85, unit: '%' }
	];

	// const chartsData = [
	// 	{
	// 		dataSets: [
	// 			{
	// 				dataY: [85, 90, 95, 80, 75, 88, 92, 85, 78, 80, 70, 65],
	// 				label: 'OEE'
	// 			}
	// 		],
	// 		dataX: createTimeRange(12),
	// 		title: 'OEE'
	// 	},
	// 	{
	// 		dataSets: [
	// 			{
	// 				dataY: [5, 7, 6, 5, 5, 4, 3, 3, 2, 2, 2, 1],
	// 				label: 'Downtime'
	// 			},
	// 			{
	// 				dataY: [95, 93, 94, 95, 95, 96, 97, 97, 98, 98, 98, 99],
	// 				label: 'Uptime'
	// 			}
	// 		],
	// 		dataX: createTimeRange(12),
	// 		title: 'Availability'
	// 	}
	// ];
</script>

<TimeRangeSelector />

<div class="grid grid-cols-1 md:grid-cols-3 md:grid-rows-1 gap-4">
	<Card.Root class="row-span-3">
		<Card.Header class="flex flex-row items-center justify-between pb-2">
			<Card.Title class="text-lg font-medium">Radial Bar Chart</Card.Title>
			<Gauge class="text-muted-foreground h-4 w-4" />
		</Card.Header>
		<Separator class="mb-4" />
		<Card.Content>
			<GaugeChart {gauges} />
		</Card.Content>
	</Card.Root>

	<Card.Root class="md:row-span-3 md:col-span-2">
		<Card.Header class="flex flex-row items-center justify-between pb-2">
			<Card.Title class="text-lg font-medium">Overall Equipment Effectiveness</Card.Title>
			<Gauge class="text-muted-foreground h-4 w-4" />
		</Card.Header>
		<Separator class="mb-4" />
		<Card.Content></Card.Content>
	</Card.Root>

	<AvailabilityCard uptime={mockData.uptime} downtime={mockData.downtime} />
	<ProductionSpeedCard productionSpeed={mockData['production speed']} />
	<QualityCard goodParts={mockData['good parts']} badParts={mockData['bad parts']} />

	<Card.Root class="md:row-span-3 md:col-span-2">
		<Card.Header class="flex flex-row items-center justify-between pb-2">
			<Card.Title class="text-lg font-medium">Availability</Card.Title>
			<Gauge class="text-muted-foreground h-4 w-4" />
		</Card.Header>
		<Separator class="mb-4" />
		<Card.Content></Card.Content>
	</Card.Root>
</div>
