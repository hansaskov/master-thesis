<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	interface Props {
		productionSpeed: number;
	}

	let { productionSpeed }: Props = $props();
</script>

<Card class="w-full">
	<CardHeader>
		<CardTitle>Performance</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="flex flex-col items-center space-y-4">
			<div class="relative w-32 h-32">
				<svg class="w-full h-full" viewBox="0 0 100 100">
					<circle
						class="text-muted stroke-current"
						stroke-width="10"
						cx="50"
						cy="50"
						r="40"
						fill="transparent"
					></circle>
					<circle
						class="text-primary stroke-current"
						stroke-width="10"
						cx="50"
						cy="50"
						r="40"
						fill="transparent"
						stroke-dasharray="251.2"
						stroke-dashoffset={251.2 - (251.2 * productionSpeed) / 500}
						transform="rotate(-90 50 50)"
					></circle>
				</svg>
				<div
					class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
				>
					<span class="text-3xl font-bold">{productionSpeed}</span>
					<span class="text-sm block">units/hr</span>
				</div>
			</div>
		</div>
	</CardContent>
</Card>
