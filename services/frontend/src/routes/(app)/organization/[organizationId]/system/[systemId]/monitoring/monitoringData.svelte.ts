// import Cpu from 'lucide-svelte/icons/cpu';
// import Truck from 'lucide-svelte/icons/truck';
// import Camera from 'lucide-svelte/icons/camera';
import Thermometer from 'lucide-svelte/icons/thermometer';
import Activity from 'lucide-svelte/icons/activity';
import { api } from '@/api';
import { timeRangeStore } from '../TimeRangeStore.svelte';
import { getLocalTimeZone } from '@internationalized/date';
import { onError } from '@/error';

// Define data structure types
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

enum TargetGroupIndex {
	computer,
	environmental
};

export async function fetchMetric(systemId: string) {
	const start = timeRangeStore.range.start?.toDate(getLocalTimeZone()).toISOString();
	const end = timeRangeStore.range.end?.toDate(getLocalTimeZone()).toISOString();

	if (!systemId || !start || !end) {
		return;
	}

	const { data, error } = await api.readings.get({
		query: {
			system_id: systemId,
			start: start,
			end: end,
			limit: 100
		}
	});

	if (error) {
		onError(error);
		return;
	}

	// clear existing metrics
	metricGroups.forEach(group => {
		group.metrics = [];
	});

	data.forEach(element => {
		console.log("element: ", element)
		let targetGroupIndex: TargetGroupIndex;
		// Find the right group based on category
		if (element.category?.toLowerCase() === "computer") {
			targetGroupIndex = TargetGroupIndex.computer;
			if (targetGroupIndex < metricGroups.length) {
				metricGroups[targetGroupIndex].metrics.push({
					name: element.name,
					value: element.value.toString(),
					unit: element.unit || ''
				});
			}
			console.log(metricGroups[targetGroupIndex].metrics)
		}
	});
	  
	  // Force reactivity update
	  metricGroups = [...metricGroups];
}

// Pre-defined metric groups
export let metricGroups: MetricGroup[] = [
	{
		title: 'Computer Metrics',
		icon: Activity,
		metrics: [
		]
	},
	// {
	// 	title: 'Hardware Metrics',
	// 	icon: Cpu,
	// 	metrics: [
	// 		{ name: 'Motor Uptime', value: '5000', unit: 'h' },
	// 		{ name: 'Motor Torque', value: '150', unit: 'Nm' },
	// 		{ name: 'Conveyor Distance', value: '10000', unit: 'm' },
	// 		{ name: 'Lighting Duration', value: '3000', unit: 'h' },
	// 		{ name: 'Battery Level', value: '85', unit: '%' },
	// 		{ name: 'Power Consumption', value: '1200', unit: 'kWh' }
	// 	]
	// },
	// {
	// 	title: 'Production Metrics',
	// 	icon: Truck,
	// 	metrics: [
	// 		{ name: 'Rejected Items', value: '52', unit: '' },
	// 		{ name: 'Air Flow Rate', value: '120', unit: 'm³/h' },
	// 		{ name: 'Pressure', value: '101', unit: 'kPa' },
	// 		{ name: 'Noise Level', value: '65', unit: 'dB' },
	// 		{ name: 'Water Consumption', value: '500', unit: 'L' }
	// 	]
	// },
	// {
	// 	title: 'Camera Metrics',
	// 	icon: Camera,
	// 	metrics: [
	// 		{ name: 'Camera Uptime', value: '4500', unit: 'h' },
	// 		{ name: 'Camera Temperature', value: '35', unit: '°C' },
	// 		{ name: 'Frame Errors', value: '3', unit: '' }
	// 	]
	// },
	{
		title: 'Environmental Metrics',
		icon: Thermometer,
		metrics: [
			{ name: 'Humidity Level', value: '45', unit: '%' },
			{ name: 'Ambient Temperature', value: '22', unit: '°C' }
		]
	}
];
