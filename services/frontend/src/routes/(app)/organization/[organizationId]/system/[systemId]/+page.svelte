<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import Monitor from 'lucide-svelte/icons/monitor';
	import Wrench from 'lucide-svelte/icons/wrench';
	import BarChart from 'lucide-svelte/icons/chart-bar';
	import Package2 from 'lucide-svelte/icons/package-2';
	import Cog from 'lucide-svelte/icons/cog';
	import { page } from '$app/state';

	// Placeholder data
	import { systems } from '@/stores/systems-mocked';

	// Get the system ID from the route parameters
	let systemId = $derived(page.params.systemId);

	const navigationOptions = [
		{
			label: 'Monitor',
			href: 'monitoring',
			icon: Monitor,
			description: 'Real-time system monitoring and alerts',
			disabled: false
		},
		{
			label: 'Service Agreements',
			href: 'service',
			icon: Wrench,
			description: 'Manage and view service contracts',
			disabled: true
		},
		{
			label: 'Production Intelligence',
			href: 'pi',
			icon: BarChart,
			description: 'Analytics and insights for system performance',
			disabled: true
		},
		{
			label: 'Spare Parts',
			href: 'parts',
			icon: Package2,
			description: 'Inventory and ordering of spare components',
			disabled: true
		},
		{
			label: 'System Settings',
			href: 'settings',
			icon: Cog,
			description: 'Alter settings such as OEE information, KPIs and more',
			disabled: false
		}
	];
</script>

<Card class="w-full max-w-4xl mx-auto border-0 shadow-none md:border md:shadow">
	<CardHeader>
		<CardTitle class="text-2xl">
			Vision System: {systems.find((system) => system.id === systemId)?.name || ''}
		</CardTitle>
		<CardDescription>
			Select an option to view or manage different aspects of this system.
		</CardDescription>
	</CardHeader>
	<CardContent>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each navigationOptions as option}
				<a href="./{systemId}/{option.href}" class="no-underline">
					<Button
						variant="outline"
						disabled={option.disabled}
						class="w-full h-auto py-4 px-6 flex flex-col items-center justify-center text-center hover:bg-secondary/20 hover:text-secondary-foreground"
					>
						<option.icon class="w-6 h-6 mb-2" />
						<span class="text-base sm:text-lg font-semibold mb-1 leading-tight">{option.label}</span
						>
						<span
							class="text-xs text-muted-foreground sm:text-sm leading-snug break-words whitespace-normal overflow-hidden text-ellipsis"
							>{option.description}</span
						>
					</Button>
				</a>
			{/each}
		</div>
	</CardContent>
</Card>
