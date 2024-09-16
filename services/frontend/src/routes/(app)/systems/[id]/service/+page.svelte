<script lang="ts">
	import { Check, X } from 'lucide-svelte';
    
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';

	const plans = [
		{
			name: 'Basic',
			price: '999 kr/mo',
			description: 'Basic system access',
			features: [
				{ name: 'Assign up to 1 user', included: true },
				{ name: 'Real-time monitoring', included: false },
				{ name: 'Email support', included: false },
				{ name: 'Downtime alerts', included: false },
				{ name: 'Performance analytics', included: false }
			],
			isCurrent: false
		},
		{
			name: 'Advanced',
			price: '2499 kr/mo',
			description: 'For small production facilities',
			features: [
				{ name: 'Assign up to 3 users', included: true },
				{ name: 'Real-time monitoring', included: true },
				{ name: 'Email support', included: true },
				{ name: 'Downtime alerts', included: false },
				{ name: 'Performance analytics', included: false }
			],
			isCurrent: false
		},
		{
			name: 'Pro',
			price: '4999 kr/mo',
			description: 'For medium-sized factories',
			features: [
				{ name: 'Assign up to 10 users', included: true },
				{ name: 'Real-time monitoring', included: true },
				{ name: 'Email support', included: true },
				{ name: 'Downtime alerts', included: true },
				{ name: 'Performance analytics', included: true }
			],
			isCurrent: true
		},
		{
			name: 'Enterprise',
			price: 'Custom',
			description: 'For large-scale manufacturing',
			features: [
				{ name: 'Unlimited users', included: true },
				{ name: 'Real-time monitoring', included: true },
				{ name: '24/7 dedicated support', included: true },
				{ name: 'AI-powered predictive maintenance', included: true },
				{ name: 'Custom analytics and reporting', included: true }
			],
			isCurrent: false
		}
	];
</script>

<h1 class="mb-8 text-center text-3xl font-bold">Production Line Service Agreement Plans</h1>
<div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
	{#each plans as plan (plan.name)}
		<Card.Root class={`flex flex-col ${plan.isCurrent ? 'border-primary' : ''}`}>
			<Card.Header>
				<Card.Title class="flex items-center justify-between">
					{plan.name}
					{#if plan.isCurrent}
						<Badge variant="default">Current Plan</Badge>
					{/if}
				</Card.Title>
				<Card.Description>{plan.description}</Card.Description>
			</Card.Header>
			<Card.Content class="flex-grow">
				<p class="mb-4 text-3xl font-bold">{plan.price}</p>
				<ul class="space-y-2">
					{#each plan.features as feature (feature.name)}
						<li class="flex items-center">
							{#if feature.included}
								<Check class="text-primary mr-2 h-4 w-4" />
							{:else}
								<X class="text-muted-foreground mr-2 h-4 w-4" />
							{/if}
							<span class={feature.included ? '' : 'text-muted-foreground'}>
								{feature.name}
							</span>
						</li>
					{/each}
				</ul>
			</Card.Content>
			<Card.Footer>
				<Button
					disabled={plan.isCurrent}
					class={`h-10 w-full`}
					variant={plan.isCurrent ? 'outline' : 'default'}
				>
					{plan.isCurrent ? 'Current Plan' : 'Choose Plan'}
				</Button>
			</Card.Footer>
		</Card.Root>
	{/each}
</div>
