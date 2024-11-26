<script lang="ts">
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import ArrowDownUp from 'lucide-svelte/icons/arrow-down-up';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { systems } from '$lib/stores/systems';
  
	type System = {
	  id: string;
	  name: string;
	  health: 'Healthy' | 'At Risk' | 'Critical';
	  status: 'Active' | 'Offline' | 'Paused';
	  type: string;
	  lastCheck: string;
	  image: string;
	};

	function getStatusVariant(status: System['status']) {
		switch (status) {
			case 'Active':
				return 'outline';
			case 'Offline':
				return 'outline';
			case 'Paused':
				return 'secondary';
		}
	}

	function getHealthVariant(health: System['health']) {
		switch (health) {
			case 'Healthy':
				return 'healthy';
			case 'At Risk':
				return 'warning';
			case 'Critical':
				return 'critical';
		}
	}
  
  
	const parseTime = (timeStr: string): number => {
	  const [value, unit] = timeStr.split(' ');
	  const multipliers = { minute: 1, hour: 60, day: 1440 };
	  return parseInt(value) * (multipliers[unit.replace(/s$/, '') as keyof typeof multipliers] || 0);
	};
  
	const sortedSystems = writable<System[]>(systems);
	let currentOrder = 1;
  
	type SortKey = 'name' | 'health' | 'status' | 'type' | 'lastCheck';
  
	const sortSystems = (key: SortKey) => {
	  sortedSystems.update(systems => {
		const sorted = [...systems].sort((a, b) => {
		  if (key === 'lastCheck') {
			return (parseTime(a[key]) - parseTime(b[key])) * currentOrder;
		  }
		  return ((a[key] > b[key]) ? 1 : -1) * currentOrder;
		});
		currentOrder *= -1;
		return sorted;
	  });
	};
  
	let name = "User"; // Replace with actual user name
  
	const headers: { label: string; key: SortKey }[] = [
	  { label: 'Name', key: 'name' },
	  { label: 'Health', key: 'health' },
	  { label: 'Status', key: 'status' },
	  { label: 'Location', key: 'type' },
	  { label: 'Last Check', key: 'lastCheck' }
	];
  </script>

<div class="md:container">
	<Card.Root class="w-full">
	  <Card.Header class="flex gap-4 md:flex-row justify-between">
		<div>
		  <Card.Title>Hello {name}</Card.Title>
		  <Card.Description>
			Monitor and manage your vision systems across different factory areas.
		  </Card.Description>
		</div>
	  </Card.Header>
	  <Card.Content>
		<div class="overflow-x-auto">
		  <Table.Root>
			<Table.Header>
			  <Table.Row>
				<Table.Head class="hidden w-[100px] md:table-cell">
				  <span class="sr-only">Image</span>
				</Table.Head>
				{#each headers as { label, key }, i}
				  <Table.Head class={i > 2 ? 'hidden md:table-cell' : ''}>
					<button on:click={() => sortSystems(key)}>
					  {label}
					  <ArrowDownUp class="w-3 h-3 inline-block ml-1" />
					</button>
				  </Table.Head>
				{/each}
			  </Table.Row>
			</Table.Header>
			<Table.Body>
			  {#each $sortedSystems as system (system.id)}
				<Table.Row
				  on:click={() => goto(`/systems/${system.id}`)}
				  class="hover:bg-muted cursor-pointer"
				>
				  <Table.Cell class="hidden md:table-cell">
					<img
					  alt="{system.name} icon"
					  class="aspect-square rounded-md object-cover"
					  height="64"
					  src={system.image}
					  width="64"
					/>
				  </Table.Cell>
				  <Table.Cell class="font-medium">{system.name}</Table.Cell>
				  <Table.Cell>
					<Badge variant={getHealthVariant(system.health)}>
					  {system.health}
					</Badge>
				  </Table.Cell>
				  <Table.Cell>
					<Badge variant={getStatusVariant(system.status)}>
					  {system.status}
					</Badge>
				  </Table.Cell>
				  <Table.Cell class="hidden md:table-cell">{system.type}</Table.Cell>
				  <Table.Cell class="hidden md:table-cell">{system.lastCheck}</Table.Cell>
				</Table.Row>
			  {/each}
			</Table.Body>
		  </Table.Root>
		</div>
	  </Card.Content>
	  <Card.Footer class="flex justify-between">
		<div class="text-muted-foreground text-xs">
		  Showing <strong>{$sortedSystems.length}</strong> of <strong>{systems.length}</strong> systems
		</div>
		<Button href="/systems" variant="outline" size="sm">
		  View All Systems
		  <ArrowRight class="ml-2 h-4 w-4" />
		</Button>
	  </Card.Footer>
	</Card.Root>
	
  </div>