<script lang="ts">
	import { ArrowRight, MoreHorizontal } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Table from '$lib/components/ui/table';
	import * as Tabs from '$lib/components/ui/tabs';
	import { goto } from '$app/navigation';
  
	const statusTypes = ["Active", "Offline", "Paused"] as const;
	type StatusType = typeof statusTypes[number];
  
	function getStatusVariant(status: StatusType) {
	  switch (status) {
		case 'Active':
		  return 'outline';
		case 'Offline':
		  return 'default';
		case 'Paused':
		  return 'secondary';
	  }
	}
  
	interface SystemsType {
	  id: string;
	  name: string;
	  status: StatusType;
	  location: string;
	  image: string;
	  lastCheck: string;
	}
  
	const systems: SystemsType[] = [
	  {
		id: "vp1",
		name: "VisioPointer® 1",
		status: "Active",
		location: "Production Line 1",
		image: "/placeholder.svg",
		lastCheck: "2 minutes ago"
	  },
	  {
		id: "vc1",
		name: "VisioCompact® 1",
		status: "Active",
		location: "Assembly Area A",
		image: "/placeholder.svg",
		lastCheck: "5 minutes ago"
	  },
	  {
		id: "360i1",
		name: "360 Inspector® 1",
		status: "Active",
		location: "Quality Control Station",
		image: "/placeholder.svg",
		lastCheck: "1 minute ago"
	  },
	  {
		id: "si1",
		name: "SmartInspector® 1",
		status: "Paused",
		location: "Packaging Line 2",
		image: "/placeholder.svg",
		lastCheck: "10 minutes ago"
	  },
	  {
		id: "vp2",
		name: "VisioPointer® 2",
		status: "Paused",
		location: "Production Line 2",
		image: "/placeholder.svg",
		lastCheck: "15 minutes ago"
	  },
	  {
		id: "vc2",
		name: "VisioCompact® 2",
		status: "Active",
		location: "Assembly Area B",
		image: "/placeholder.svg",
		lastCheck: "8 minutes ago"
	  },
	  {
		id: "vp3",
		name: "VisioPointer® 3",
		status: "Paused",
		location: "Production Line 2",
		image: "/placeholder.svg",
		lastCheck: "15 minutes ago"
	  },
	  {
		id: "vp4",
		name: "VisioPointer® 4",
		status: "Offline",
		location: "Assembly Area B",
		image: "/placeholder.svg",
		lastCheck: "5 hours ago"
	  }
	];
  
	let activeTab = "All";
  
	$: filteredSystems = activeTab === "All" 
	  ? systems 
	  : systems.filter(system => system.status === activeTab);
	  
	function handleRowClick(id: string) {
		goto(`/systems/${id}`);
	}
</script>
  
<Tabs.Root bind:value={activeTab}>
	<Tabs.List>
	  <Tabs.Trigger value="All">All</Tabs.Trigger>
	  <Tabs.Trigger value="Active">Active</Tabs.Trigger>
	  <Tabs.Trigger value="Paused">Paused</Tabs.Trigger>
	  <Tabs.Trigger value="Offline">Offline</Tabs.Trigger>
	</Tabs.List>
  
	<Card.Root class="w-full">
	  <Card.Header>
		<Card.Title>Production Systems</Card.Title>
		<Card.Description>
		  Monitor and manage your production systems across different factory areas.
		</Card.Description>
	  </Card.Header>
	  <Card.Content>
		<Tabs.Content value={activeTab}>       
		  <div class="overflow-x-auto">
			<Table.Root>
			  <Table.Header>
				<Table.Row>
				  <Table.Head class="w-[100px] hidden md:table-cell">
					<span class="sr-only">Image</span>
				  </Table.Head>
				  <Table.Head>Name</Table.Head>
				  <Table.Head class="hidden md:table-cell">Status</Table.Head>
				  <Table.Head class="hidden md:table-cell">Location</Table.Head>
				  <Table.Head class="hidden md:table-cell">Last Check</Table.Head>
				  <Table.Head>Actions</Table.Head>
				</Table.Row>
			  </Table.Header>
			  <Table.Body>
				{#each filteredSystems as system (system.id)}
				  <Table.Row on:click={() => handleRowClick(system.id)} class="cursor-pointer hover:bg-muted">
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
					  <Badge variant={getStatusVariant(system.status)}>
						{system.status}
					  </Badge>
					</Table.Cell>
					<Table.Cell class="hidden md:table-cell">{system.location}</Table.Cell>
					<Table.Cell class="hidden md:table-cell">{system.lastCheck}</Table.Cell>
					<Table.Cell class="text-right">
					  <div class="flex items-center justify-end gap-2">
						<DropdownMenu.Root>
						  <DropdownMenu.Trigger asChild let:builder>
							<Button builders={[builder]} size="icon" variant="ghost">
							  <MoreHorizontal class="h-4 w-4" />
							  <span class="sr-only">Actions</span>
							</Button>
						  </DropdownMenu.Trigger>
						  <DropdownMenu.Content align="end">
							<DropdownMenu.Label>Actions</DropdownMenu.Label>
							<DropdownMenu.Item>
							  <a href="/systems/{system.id}">View Details</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item>Restart System</DropdownMenu.Item>
						  </DropdownMenu.Content>
						</DropdownMenu.Root>
					  </div>
					</Table.Cell>
				  </Table.Row>
				{/each}
			  </Table.Body>
			</Table.Root>
		  </div>
		</Tabs.Content>
	  </Card.Content>
	  <Card.Footer class="flex justify-between">
		<div class="text-xs text-muted-foreground">
		  Showing <strong>{filteredSystems.length}</strong> of <strong>{systems.length}</strong> systems
		</div>
		<Button  href="/systems" variant="outline" size="sm">
		  
			View All Systems
			<ArrowRight class="ml-2 h-4 w-4" />
		  
		</Button>
	  </Card.Footer>
	</Card.Root>
</Tabs.Root>