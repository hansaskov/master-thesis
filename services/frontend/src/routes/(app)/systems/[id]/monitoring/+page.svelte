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

	const getHoursAgo = (hours: number) => {
		const date = new Date(Date.now() - hours * 60 * 60 * 1000);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	const createTimeRange = (count: number) =>
		[...Array(count)].map((_, i) => getHoursAgo(count - 1 - i));

	const chartsData = [
		{
			dataY: [65, 59, 80, 81, 56, 55, 40, 42, 45, 47, 35, 35],
			dataX: createTimeRange(12),
			legend: 'CPU temperature',
			description: 'CPU temperature in degrees Celsius over the last 7 hours'
		},
		{
			dataY: [85, 90, 95, 80, 75, 88, 92, 85, 78, 80, 70, 65],
			dataX: createTimeRange(12),
			legend: 'Memory usage',
			description: 'Memory usage percentage over the last 12 hours'
		},
		{
			dataY: [43, 43, 44, 45, 45, 46, 47, 47, 48, 48, 48, 49],
			dataX: createTimeRange(12),
			legend: 'Disk space',
			description: 'Available disk space percentage over the last 12 hours'
		}
	];
</script>

<!-- Charts Section -->
<div class="mb-8">
	<h2 class="mb-4 text-2xl font-bold">Charts</h2>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each chartsData as { dataX, dataY, legend, description}}
			<Card>
				<CardHeader>
					<CardTitle class="text-xl font-bold">{legend}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent>
					<AreaChart {dataY} {dataX} {legend} />
				</CardContent>
			</Card>
		{/each}
	</div>
</div>

<!-- Metrics Section -->
<div>
	<h2 class="mb-4 text-2xl font-bold">Metrics</h2>
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
