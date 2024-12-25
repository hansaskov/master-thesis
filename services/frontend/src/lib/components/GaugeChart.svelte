<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import { Label } from '$lib/components/ui/label';
	import { Badge } from '$lib/components/ui/badge';

	let chartCanvas = $state<HTMLCanvasElement>();

	interface GaugeData {
		label: string;
		min?: number;
		max?: number;
		unit?: string;
		value: number;
	}

	interface Props {
		gauges: GaugeData[];
	}

	let { gauges, ...rest }: Props = $props();
	let primaryColor: string;

	onMount(() => {
		const ctx = chartCanvas?.getContext('2d');
		if (ctx) {
			primaryColor = getComputedStyle(document.documentElement)
				.getPropertyValue('--primary')
				.trim();

			const backgroundColor = getComputedStyle(document.documentElement)
				.getPropertyValue('--card')
				.trim();

			new Chart(ctx, {
				type: 'doughnut',
				data: {
					datasets: gauges.map((gauge, i) => {
						const min = gauge.min || 0;
						const max = gauge.max || 100;
						const percentage = (gauge.value - min) / (max - min);
						const color = `hsl(${primaryColor} / ${1 - i / gauges.length})`;

						return {
							label: gauge.label,
							data: [gauge.value],
							circumference: percentage * 360,
							rotation: 360 - percentage * 360,
							backgroundColor: color,
							borderRadius: 20,
							borderWidth: 5
						};
					})
				},
				options: {
					responsive: true,
					borderColor: `hsl(${backgroundColor} / 0.95 )`,
					cutout: '33%',
					animation: {
						animateScale: true,
						easing: 'easeOutExpo'
					},
					layout: {
						padding: {
							left: 25,
							top: 0,
							bottom: 0
						}
					}
				}
			});
		}
	});
</script>

<div {...rest}>
	<div class="my-4 flex flex-wrap justify-center gap-2">
		{#each gauges as gauge, i}
			<div class="flex items-center">
				{#if i === 0}
					<Badge class="bg-primary">
						{gauge.value}{gauge.unit ?? ''}
					</Badge>
				{:else if i === 1}
					<Badge class="bg-primary/[67%]">
						{gauge.value}{gauge.unit ?? ''}
					</Badge>
				{:else if i === 2}
					<Badge class="bg-primary/[33%] text-foreground">
						{gauge.value}{gauge.unit ?? ''}
					</Badge>
				{/if}

				<Label class="ml-2">{gauge.label}</Label>
			</div>
		{/each}
	</div>
	<canvas bind:this={chartCanvas}></canvas>
</div>
