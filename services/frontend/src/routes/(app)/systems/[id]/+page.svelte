<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import Monitor from "lucide-svelte/icons/monitor";
	import Wrench from "lucide-svelte/icons/wrench";
	import BarChart from "lucide-svelte/icons/chart-bar";
	import Package2 from "lucide-svelte/icons/package-2";
  
	export let systemId = "vp1";
  
	const navigationOptions = [
	  {
		label: "Monitor",
		href: "monitoring",
		icon: Monitor,
		description: "Real-time system monitoring and alerts"
	  },
	  {
		label: "Service Agreements",
		href: "service",
		icon: Wrench,
		description: "Manage and view service contracts"
	  },
	  {
		label: "Product Intelligence",
		href: "pi",
		icon: BarChart,
		description: "Analytics and insights for system performance"
	  },
	  {
		label: "Spare Parts",
		href: "parts",
		icon: Package2,
		description: "Inventory and ordering of spare components"
	  }
	];
  </script>
  
  <Card class="w-full max-w-4xl mx-auto">
	<CardHeader>
	  <CardTitle class="text-2xl">Production System: {systemId}</CardTitle>
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
			  class="w-full h-auto py-4 px-6 flex flex-col items-center justify-center text-center hover:bg-primary/5"
			>
			  <svelte:component this={option.icon} class="w-6 h-6 mb-2" />
			  <span class="text-lg font-semibold mb-1">{option.label}</span>
			  <span class="text-sm text-muted-foreground">{option.description}</span>
			</Button>
		  </a>
		{/each}
	  </div>
	</CardContent>
  </Card>