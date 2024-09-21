<script lang="ts">
    import { onMount } from 'svelte';
    import Chart, { type ChartConfiguration, type ChartData, type ChartDataset } from 'chart.js/auto';

    let chartCanvas: HTMLCanvasElement;

    interface DataSet {
        dataY: number[];
        legend: string;
    }

    export let dataX: string[];
    export let dataSets: DataSet[];
	export let useLegend = true;

    onMount(() => {
        const ctx = chartCanvas.getContext('2d');
        if (ctx) {
            const primaryColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--primary')
                .trim();
            const colors = [
                { bg: `hsl(${primaryColor} / 0.3)`, border: `hsl(${primaryColor})` },
                { bg: `hsl(${primaryColor} / 0.15)`, border: `hsl(${primaryColor})` },
                { bg: `hsl(${primaryColor} / 0.1)`, border: `hsl(${primaryColor})` }
            ];

            const datasets: ChartDataset<'line', number[]>[] = dataSets.map((set, index) => ({
                label: set.legend,
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
                            display: useLegend
                        }
                    }
                }
            };

            new Chart(ctx, config);
        }
    });
</script>

<div {...$$restProps}>
    <canvas bind:this={chartCanvas}></canvas>
</div>