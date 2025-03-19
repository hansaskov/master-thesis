<script lang="ts">
	import { onMount } from 'svelte';

	import { timeRangeStore } from '../TimeRangeStore.svelte';
	import { getLocalTimeZone } from '@internationalized/date';
	import Metrics from './Metrics.svelte';
	import { monitorStore } from '@/stores/monitor.svelte';
	import MonitoringCharts from './MonitoringCharts.svelte';

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
</script>

<!-- Charts Section -->
<MonitoringCharts />
<!-- Metrics Section -->
<Metrics />
