<script lang="ts">
	import { page } from '$app/stores';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { Activity, Cpu, Truck, Camera, Thermometer, BarChart } from 'lucide-svelte';

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
		},
		{
			title: 'Security Metrics',
			icon: BarChart,
			metrics: [{ name: 'Security Incidents', value: '0', unit: '' }]
		}
	];
</script>

<h1 class="mb-6 text-3xl font-bold">Monitoring {systemId}</h1>
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
