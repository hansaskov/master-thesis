<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import Check from 'lucide-svelte/icons/check';
	import X from 'lucide-svelte/icons/x';
	import { onMount } from 'svelte';

	$: systemId = $page.params.id;

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

	// Array to hold the names of the open accordions
	let openAccordions: string[] = [];

	// Function to progressively open accordions, starting the first one immediately
	function openAccordionsSequentially() {
		let index = 0;

		// Open the first accordion immediately
		openAccordions = [plans[index].name];
		index++;

		// Sequentially open the rest with a delay
		const intervalId = setInterval(() => {
			if (index < plans.length) {
				openAccordions = [...openAccordions, plans[index].name];
				index++;
			} else {
				clearInterval(intervalId);
			}
		}, 450); // 500ms delay between each accordion opening
	}

	// onMount to trigger the sequential accordion opening immediately
	onMount(() => {
		openAccordionsSequentially();
	});
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-3xl font-bold">Service Agreement Plans for {systemId}</h1>
	
	<div class="space-y-6 md:hidden">
	  <Accordion.Root value={openAccordions}>
		{#each plans as plan (plan.name)}
		  <Accordion.Item value={plan.name}>
			<Accordion.Trigger>
			  <div class="flex items-center justify-between w-full">
				<span>{plan.name}</span>
				<span class="text-lg font-semibold">{plan.price}</span>
			  </div>
			</Accordion.Trigger>
			<Accordion.Content transitionConfig={{duration: 500}}>
			  <div class="mt-4 space-y-4">
				<p class="text-sm text-muted-foreground">{plan.description}</p>
				<ul class="space-y-2">
				  {#each plan.features as feature (feature.name)}
					<li class="flex items-center text-sm">
					  {#if feature.included}
						<Check class="mr-2 h-4 w-4 text-primary" />
					  {:else}
						<X class="mr-2 h-4 w-4 text-muted-foreground" />
					  {/if}
					  <span class={feature.included ? '' : 'text-muted-foreground'}>
						{feature.name}
					  </span>
					</li>
				  {/each}
				</ul>
				<Button
				  disabled={plan.isCurrent}
				  class="w-full"
				  variant={plan.isCurrent ? 'outline' : 'default'}
				>
				  {plan.isCurrent ? 'Current Plan' : 'Choose Plan'}
				</Button>
			  </div>
			</Accordion.Content>
		  </Accordion.Item>
		{/each}
	  </Accordion.Root>
	</div>

	<div class="hidden md:grid md:grid-cols-2 xl:grid-cols-4 gap-6">
	  {#each plans as plan (plan.name)}
		<div class={`flex flex-col rounded-lg border p-6 ${plan.isCurrent ? 'border-primary' : 'border-border'}`}>
		  <div class="mb-4 flex items-center justify-between">
			<h3 class="text-lg font-semibold">{plan.name}</h3>
			{#if plan.isCurrent}
			  <Badge variant="default">Current Plan</Badge>
			{/if}
		  </div>
		  <p class="mb-2 text-2xl font-bold">{plan.price}</p>
		  <p class="mb-4 text-sm text-muted-foreground">{plan.description}</p>
		  <ul class="mb-6 flex-grow space-y-2">
			{#each plan.features as feature (feature.name)}
			  <li class="flex items-center text-sm">
				{#if feature.included}
				  <Check class="mr-2 h-4 w-4 text-primary" />
				{:else}
				  <X class="mr-2 h-4 w-4 text-muted-foreground" />
				{/if}
				<span class={feature.included ? '' : 'text-muted-foreground'}>
				  {feature.name}
				</span>
			  </li>
			{/each}
		  </ul>
		  <Button
			disabled={plan.isCurrent}
			class="w-full"
			variant={plan.isCurrent ? 'outline' : 'default'}
		  >
			{plan.isCurrent ? 'Current Plan' : 'Choose Plan'}
		  </Button>
		</div>
	  {/each}
	</div>
</div>
