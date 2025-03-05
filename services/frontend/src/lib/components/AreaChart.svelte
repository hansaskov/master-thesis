<script lang="ts">
	import { AreaChart } from 'layerchart';

	const { data }: { data: { date: Date; value: number }[] } = $props();
</script>

<div class="h-64 p-4 border rounded">
	<AreaChart {data} x="date" y="value" renderContext="svg" />
</div>
