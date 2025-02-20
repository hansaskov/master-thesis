<!-- OEE.svelte -->
<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';

	interface Props {
		oee: number;
	}

	let { oee }: Props = $props();
</script>

<Card class="w-full">
	<CardHeader>
		<CardTitle>OEE</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="flex flex-col space-y-4">
			<div>
				<h3 class="text-2xl font-bold">{oee}%</h3>
				<p class="text-sm text-muted-foreground">Overall Equipment Effectiveness</p>
				<Progress value={oee} class="mt-2" />
			</div>
		</div>
	</CardContent>
</Card>
