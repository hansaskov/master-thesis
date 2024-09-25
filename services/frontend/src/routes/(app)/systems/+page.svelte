<script lang="ts">
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { goto } from '$app/navigation';

	import OrgCombobox from './OrgCombobox.svelte';

	const statusTypes = ['Active', 'Offline', 'Paused'] as const;
	type StatusType = (typeof statusTypes)[number];

	const healthTypes = ['Healthy', 'At Risk', 'Critical'] as const;
	type HealthType = (typeof healthTypes)[number];

	function getStatusVariant(status: StatusType) {
		switch (status) {
			case 'Active':
				return 'outline';
			case 'Offline':
				return 'outline';
			case 'Paused':
				return 'secondary';
		}
	}

	function getHealthVariant(health: HealthType) {
		switch (health) {
			case 'Healthy':
				return 'healthy';
			case 'At Risk':
				return 'warning';
			case 'Critical':
				return 'critical';
		}
	}

	interface SystemsType {
		id: string;
		name: string;
		health: HealthType;
		status: StatusType;
		location: string;
		image: string;
		lastCheck: string;
	}

	let systems: SystemsType[] = [
		{
			id: 'vp1',
			name: 'VisioPointer® 1',
			health: 'Healthy',
			status: 'Active',
			location: 'Production Line 1',
			image: '/placeholder.svg',
			lastCheck: '2 minutes ago'
		},
		{
			id: 'vc1',
			name: 'VisioCompact® 1',
			health: 'At Risk',
			status: 'Active',
			location: 'Assembly Area A',
			image: '/placeholder.svg',
			lastCheck: '5 minutes ago'
		},
		{
			id: '360i1',
			name: '360 Inspector® 1',
			health: 'Healthy',
			status: 'Active',
			location: 'Quality Control Station',
			image: '/placeholder.svg',
			lastCheck: '1 minute ago'
		},
		{
			id: 'si1',
			name: 'SmartInspector® 1',
			health: 'Critical',
			status: 'Paused',
			location: 'Packaging Line 2',
			image: '/placeholder.svg',
			lastCheck: '10 minutes ago'
		},
		{
			id: 'vp2',
			name: 'VisioPointer® 2',
			health: 'Healthy',
			status: 'Paused',
			location: 'Production Line 2',
			image: '/placeholder.svg',
			lastCheck: '15 minutes ago'
		},
		{
			id: 'vc2',
			name: 'VisioCompact® 2',
			health: 'Healthy',
			status: 'Active',
			location: 'Assembly Area B',
			image: '/placeholder.svg',
			lastCheck: '8 minutes ago'
		},
		{
			id: 'vp3',
			name: 'VisioPointer® 3',
			health: 'Healthy',
			status: 'Paused',
			location: 'Production Line 2',
			image: '/placeholder.svg',
			lastCheck: '15 minutes ago'
		},
		{
			id: 'vp4',
			name: 'VisioPointer® 4',
			health: 'Healthy',
			status: 'Offline',
			location: 'Assembly Area B',
			image: '/placeholder.svg',
			lastCheck: '5 hours ago'
		}
	];

	function handleRowClick(id: string) {
		goto(`/systems/${id}`);
	}

	function parseTime(timeStr: string) {
		const timeParts = timeStr.split(' ');
		const value = parseInt(timeParts[0], 10);
		const unit = timeParts[1];

		switch (unit) {
			case 'minute':
			case 'minutes':
				return value;
			case 'hour':
			case 'hours':
				return value * 60;
			case 'day':
			case 'days':
				return value * 60 * 24;
			default:
				return 0; 
		}
	}

	enum sortingOrder {
		ascending = 1,
		descending = -1
	}

	let currentOrder: sortingOrder = sortingOrder.ascending;

	function sortSystems(sort: string) {
		switch (sort) {
			case 'name':
				systems.sort((a, b) => {
					if (a.name > b.name) {
						return 1 * currentOrder;
					}
					if (a.name < b.name) {
						return -1 * currentOrder;
					} 
						return 0;
					})
					break;
			case 'health':
				systems.sort((a, b) => {
					if (a.health > b.health) {
						return 1 * currentOrder;
					}
					if (a.health < b.health) {
						return -1 * currentOrder;
					} 
						return 0;
					})
					break;
			case 'status':
				systems.sort((a, b) => {
					if (a.status > b.status) {
						return 1 * currentOrder;
					}
					if (a.status < b.health) {
						return -1 * currentOrder;
					} 
						return 0;
					})
					break;
			
			case 'location':
				systems.sort((a, b) => {
					if (a.location > b.location) {
						return 1 * currentOrder;
					}
					if (a.location < b.location) {
						return -1 * currentOrder;
					} 
						return 0;
					})
					break;
			case 'check':
				systems.sort((a, b) => {
					let first = parseTime(a.lastCheck);
					let second = parseTime(b.lastCheck);

					if (first> second) {
						return 1 * currentOrder;
					}
					if (first < second) {
						return -1 * currentOrder;
					} 
						return 0;
					})
					break;
		}
		if (currentOrder === sortingOrder.descending) {
				currentOrder = sortingOrder.ascending;
			} else {
				currentOrder = sortingOrder.descending;
			}
			
			systems = systems;
	}

</script>
<div class="md:container">
	<Card.Root class="w-full">
		<Card.Header class="flex gap-4 md:flex-row justify-between">
			<div>
				<Card.Title> 
					Hi *Name*
				</Card.Title>
				<Card.Description>
					Monitor and manage your production systems across different factory areas.
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
								<Table.Head>
									<button on:click={() => {sortSystems('name')}}>
										Name
									</button>
								</Table.Head>
								<Table.Head>
									<button on:click={() => {sortSystems('health')}}>
										Health
									</button>
								</Table.Head>
								<Table.Head>
									<button on:click={() => {sortSystems('status')}}>
										Status
									</button>
								</Table.Head>
								<Table.Head class="hidden md:table-cell">
									<button on:click={() => {sortSystems('location')}}>
										Location
									</button>
								</Table.Head>
								<Table.Head class="hidden md:table-cell">
									<button on:click={() => {sortSystems('check')}}>
										Last Check
									</button>
								</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each systems as system (system.id)}
								<Table.Row
									on:click={() => handleRowClick(system.id)}
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
									<Table.Cell class="bg-wa font-medium">{system.name}</Table.Cell>
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
									<Table.Cell class="hidden md:table-cell">{system.location}</Table.Cell>
									<Table.Cell class="hidden md:table-cell">{system.lastCheck}</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
		</Card.Content>
		<Card.Footer class="flex justify-between">
			<div class="text-muted-foreground text-xs">
				Showing <strong>{systems.length}</strong>
				of
				<strong>{systems.length}</strong>
				systems
			</div>
			<Button href="/systems" variant="outline" size="sm">
				View All Systems
				<ArrowRight class="ml-2 h-4 w-4" />
			</Button>
		</Card.Footer>
	</Card.Root>
</div>