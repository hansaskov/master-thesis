<script lang="ts">
	import { page } from '$app/stores';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { Activity, Cpu, Truck, Camera, Thermometer } from 'lucide-svelte';
	import AreaChart from '$lib/components/AreaChart.svelte';

	$: systemId = $page.params.id;

	interface Metric {
		name: string;
		value: string;
		unit: string;
	}

	interface MetricGroup {
		title: string;
		icon: typeof Activity;
		metrics: Metric[];
	}

	const metricGroups: MetricGroup[] = [
		{
			title: 'System Metrics',
			icon: Activity,
			metrics: [
				{ name: 'System Version', value: '3.2.1', unit: '' },
				{ name: 'CPU Load', value: '45', unit: '%' },
				{ name: 'Processor Temperature', value: '62', unit: '°C' },
				{ name: 'Memory Utilization', value: '70', unit: '%' },
				{ name: 'Available Storage', value: '256', unit: 'GB' },
				{ name: 'Total Disk Write', value: '1024', unit: 'GB' },
				{ name: 'Network Latency', value: '5', unit: 'ms' },
				{ name: 'System Uptime', value: '720', unit: 'h' }
			]
		},
		{
			title: 'Hardware Metrics',
			icon: Cpu,
			metrics: [
				{ name: 'Motor Uptime', value: '5000', unit: 'h' },
				{ name: 'Motor Torque', value: '150', unit: 'Nm' },
				{ name: 'Conveyor Distance', value: '10000', unit: 'm' },
				{ name: 'Lighting Duration', value: '3000', unit: 'h' },
				{ name: 'Battery Level', value: '85', unit: '%' },
				{ name: 'Power Consumption', value: '1200', unit: 'kWh' }
			]
		},
		{
			title: 'Production Metrics',
			icon: Truck,
			metrics: [
				{ name: 'Rejected Items', value: '52', unit: '' },
				{ name: 'Air Flow Rate', value: '120', unit: 'm³/h' },
				{ name: 'Pressure', value: '101', unit: 'kPa' },
				{ name: 'Noise Level', value: '65', unit: 'dB' },
				{ name: 'Water Consumption', value: '500', unit: 'L' }
			]
		},
		{
			title: 'Camera Metrics',
			icon: Camera,
			metrics: [
				{ name: 'Camera Uptime', value: '4500', unit: 'h' },
				{ name: 'Camera Temperature', value: '35', unit: '°C' },
				{ name: 'Frame Errors', value: '3', unit: '' }
			]
		},
		{
			title: 'Environmental Metrics',
			icon: Thermometer,
			metrics: [
				{ name: 'Humidity Level', value: '45', unit: '%' },
				{ name: 'Ambient Temperature', value: '22', unit: '°C' }
			]
		}
	];


	let dataY = [65, 59, 80, 81, 56, 55, 40]
	let dataX = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
	let legend = "Sales"

	// Sample data for the new charts
	let barDataY = [12, 19, 3, 5, 2, 3];
	let barDataX = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
	let barLegend = "Color Distribution";

	let lineDataY = [1, 2, 3, 4, 5, 6, 7];
	let lineDataX = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
	let lineLegend = "Weekly Trend";

</script>

<!-- Charts Section -->
<div class="mb-8">
	<h2 class="text-2xl font-bold mb-4">Charts</h2>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			<Card>
					<CardHeader>
							<CardTitle class="text-xl font-bold">Sales Overview</CardTitle>
							<CardDescription>Monthly sales data for the current year</CardDescription>
					</CardHeader>
					<CardContent>
							<AreaChart dataY={dataY} dataX={dataX} legend={legend} />
					</CardContent>
			</Card>

			<Card>
					<CardHeader>
							<CardTitle class="text-xl font-bold">Color Distribution</CardTitle>
							<CardDescription>Distribution of colors in inventory</CardDescription>
					</CardHeader>
					<CardContent>
							<AreaChart dataY={barDataY} dataX={barDataX} legend={barLegend} />
					</CardContent>
			</Card>

			<Card>
					<CardHeader>
							<CardTitle class="text-xl font-bold">Weekly Trend</CardTitle>
							<CardDescription>Performance trend over the past week</CardDescription>
					</CardHeader>
					<CardContent>
							<AreaChart dataY={lineDataY} dataX={lineDataX} legend={lineLegend} />
					</CardContent>
			</Card>
	</div>
</div>

<!-- Metrics Section -->
<div>
	<h2 class="text-2xl font-bold mb-4">Metrics</h2>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each metricGroups as group}
					<Card>
							<CardHeader>
									<CardTitle class="flex items-center gap-2">
											<svelte:component this={group.icon} class="h-4 w-4" />
											<span>{group.title}</span>
									</CardTitle>
							</CardHeader>
							<CardContent>
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
							</CardContent>
					</Card>
			{/each}
	</div>
</div>