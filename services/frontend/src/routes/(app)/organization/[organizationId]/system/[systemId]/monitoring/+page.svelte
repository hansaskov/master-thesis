<script lang="ts">
	import { getLocalTimeZone } from '@internationalized/date';
	import Metrics from './Metrics.svelte';
	import { monitorStore } from '@/stores/monitor.svelte';
	import MonitoringCharts from './MonitoringCharts.svelte';
	import TimeRangeSelector from '../TimeRangeSelector.svelte';
	import { timeRangeStore } from '@/stores/TimeRangeStore.svelte';
	import RefreshRateSelector from './RefreshRateSelector2.svelte';

	async function fetchReadings() {
		const { start, end } = timeRangeStore.range;

		if (!start || !end) {
			console.warn('fetchReadings returned early');
			return;
		}

		// Choose a larger interval for values above 10 minutes
		if (timeRangeStore.valueInSeconds && timeRangeStore.valueInSeconds > 60 * 10) {
			monitorStore.refresh({
				resolution: '5 min',
				start: start.toDate(getLocalTimeZone()).toISOString(),
				end: end.toDate(getLocalTimeZone()).toISOString(),
				limit: 3600
			});
			// Else just choose the full resolution.
		} else {
			monitorStore.refresh({
				resolution: 'full',
				start: start.toDate(getLocalTimeZone()).toISOString(),
				end: end.toDate(getLocalTimeZone()).toISOString(),
				limit: 3600
			});
		}
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
</script>

<div class="mb-8">
	<div class="mb-4 flex flex-col md:flex-row justify-between md:items-center">
		<h2 class="text-2xl font-bold">Charts</h2>
		<div class="flex flex-row">
			<RefreshRateSelector />
			<TimeRangeSelector></TimeRangeSelector>
		</div>
	</div>

	<!-- Charts Section -->
	<MonitoringCharts />
</div>

<div class="mb-8">
	<!-- Metrics Section -->
	<h2 class="mb-4 text-2xl font-bold">Metrics</h2>
	<Metrics />
</div>
