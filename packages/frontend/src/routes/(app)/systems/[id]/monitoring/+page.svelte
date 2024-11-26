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
	import Activity from 'lucide-svelte/icons/activity';

	import Cpu from 'lucide-svelte/icons/cpu';
	import Truck from 'lucide-svelte/icons/truck';
	import Camera from 'lucide-svelte/icons/camera';
	import Thermometer from 'lucide-svelte/icons/thermometer';
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

    function createTimeRange(hours: number): string[] {
        const now = new Date();
        return Array.from({ length: hours }, (_, i) => {
            const time = new Date(now.getTime() - (hours - 1 - i) * 60 * 60 * 1000);
            return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });
    }

    const chartsData = [
        {
            dataSets: [
                {
                    dataY: [65, 59, 80, 81, 56, 55, 40, 42, 45, 47, 35, 35],
                    label: 'CPU temperature'
                }
            ],
            dataX: createTimeRange(12),
            title: 'CPU Temperature',
            description: 'CPU temperature in degrees Celsius over the last 12 hours'
        },
        {
            dataSets: [
                {
                    dataY: [85, 90, 95, 80, 75, 88, 92, 85, 78, 80, 70, 65],
                    label: 'Memory usage'
                }
            ],
            dataX: createTimeRange(12),
            title: 'Memory Usage',
            description: 'Memory usage percentage over the last 12 hours'
        },
        {
            dataSets: [
                {
                    dataY: [43, 43, 44, 45, 45, 46, 47, 47, 48, 48, 48, 49],
                    label: 'Available space'
                },
                {
                    dataY: [57, 57, 56, 55, 55, 54, 53, 53, 52, 52, 52, 51],
                    label: 'Used space'
                }
            ],
            dataX: createTimeRange(12),
            title: 'Disk Space',
            description: 'Available and used disk space percentage over the last 12 hours'
        }
    ];
</script>

<!-- Charts Section -->
<div class="mb-8">
    <h2 class="mb-4 text-2xl font-bold">Charts</h2>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each chartsData as { dataSets, dataX, title, description }}
            <Card>
                <CardHeader>
                    <CardTitle class="text-xl font-bold">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <AreaChart {dataSets} {dataX} />
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
