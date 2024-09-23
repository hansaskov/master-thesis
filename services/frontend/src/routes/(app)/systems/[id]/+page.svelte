<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Monitor, Wrench, ChartLine, Package2 } from 'lucide-svelte';

	// Get the system ID from the route parameters
	$: systemId = $page.params.id;

	const navigationButtons = [
		{ label: 'Monitor', href: `monitoring` },
		{ label: 'Service', href: `service` },
		{ label: 'PI', href: `pi` },
		{ label: 'Parts', href: `parts` }
	];
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>System Details: {systemId}</Card.Title>
		<Card.Description>
			Select an option to view or manage different aspects of this system.
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
				<Button variant="outline" href="{systemId}/monitoring" class="w-full">
					<ChartLine class="h-5 w-5" />
					Monitor
				</Button>
				<Button variant="outline" href="{systemId}/service" class="w-full">
					<Wrench class="h-5 w-5" />
					Service
				</Button>
				<Button variant="outline" href="{systemId}/pi" class="w-full">
					<Monitor class="h-5 w-5" />
					PI
				</Button>
				<Button variant="outline" href="{systemId}/parts" class="w-full">
					<Package2 class="h-5 w-5" />
					Parts
				</Button>
		</div>
	</Card.Content>
</Card.Root>
