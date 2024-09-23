<script lang="ts">
	import { onMount } from 'svelte';
	import Chart, { type ChartConfiguration, type ChartData, type ChartDataset } from 'chart.js/auto';

	import { Label } from '$lib/components/ui/label';
	import { Badge } from '$lib/components/ui/badge';

	let chartCanvas: HTMLCanvasElement;

	interface DataSet {
		dataY: number[];
		label: string;
		unit?: string;
	}

	export let dataX: string[];
	export let dataSets: DataSet[];
    export let min: number | undefined = undefined;
    export let max: number | undefined = undefined;


	onMount(() => {
		const ctx = chartCanvas.getContext('2d');
		if (ctx) {
			const primaryColor = getComputedStyle(document.documentElement)
				.getPropertyValue('--primary')
				.trim();
			const colors = [
				{ bg: `hsl(${primaryColor} / 0.3)`, border: `hsl(${primaryColor})` },
				{ bg: `hsl(${primaryColor} / 0.10)`, border: `hsl(${primaryColor})` },
				{ bg: `hsl(${primaryColor} / 0.7)`, border: `hsl(${primaryColor})` }
			];

			const datasets: ChartDataset<'line', number[]>[] = dataSets.map((set, index) => ({
				label: set.label,
				data: set.dataY,
				fill: true,
				backgroundColor: colors[index % colors.length].bg,
				borderColor: colors[index % colors.length].border,
				tension: 0.4
			}));

			const config: ChartConfiguration = {
				type: 'line',
				data: {
					labels: dataX,
					datasets: datasets
				},
				options: {
					responsive: true,
					maintainAspectRatio: true,
					plugins: {
						legend: {
							display: false
						}
					},
                    scales: {
                        y: {
                            min: min,
                            max: max,
                        }
                    }

				}
			};

			new Chart(ctx, config);
		}
	});
</script>

<div {...$$restProps}>
	<div class="my-4 flex flex-wrap justify-center gap-2">
		{#each dataSets as { label }, i}
			<div class="flex">

                {#if i === 0}
                    <Badge class="h-4 w-12 bg-primary/60"/>
                {:else if i===1}
                    <Badge class="h-4 w-12 bg-primary/20"/>
                {:else if i === 2 }
                    <Badge class="h-4 w-12 bg-primary/100"/>        
                {/if}   


				<Label class="ml-2">{label}</Label>
			</div>
		{/each}
	</div>

	<canvas bind:this={chartCanvas}></canvas>
</div>
