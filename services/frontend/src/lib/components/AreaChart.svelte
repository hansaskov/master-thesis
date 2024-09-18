<script lang="ts">
	import { onMount } from 'svelte';
	import Chart, { type ChartConfiguration } from 'chart.js/auto';

	let chartCanvas: HTMLCanvasElement;
	export let dataY: number[];
	export let dataX: string[];
	export let legend: string;

	onMount(() => {
		const ctx = chartCanvas.getContext('2d');
		if (ctx) {
			const primaryColor = getComputedStyle(document.documentElement)
				.getPropertyValue('--primary')
				.trim();

			const config: ChartConfiguration = {
				type: 'line',
				data: {
					labels: dataX,
					datasets: [
						{
							label: legend,
							data: dataY,
							fill: true,
							backgroundColor: `hsl(${primaryColor} / 0.2)`,
							borderColor: `hsl(${primaryColor})`,
							tension: 0.1
						}

					]
				},
				options: {
					responsive: true
				}
			};

			new Chart(ctx, config);
		}
	});
</script>

<div {...$$restProps}>
	<canvas bind:this={chartCanvas}></canvas>
</div>
