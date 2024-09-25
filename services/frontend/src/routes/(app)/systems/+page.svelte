<script lang="ts">
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import ArrowDownUp from 'lucide-svelte/icons/arrow-down-up';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { goto } from '$app/navigation';

	//placeholder data
	import { systems } from '$lib/stores/index';

	function getStatusVariant(status: any) {
		switch (status) {
			case 'Active':
				return 'outline';
			case 'Offline':
				return 'outline';
			case 'Paused':
				return 'secondary';
		}
	}

	function getHealthVariant(health: any) {
		switch (health) {
			case 'Healthy':
				return 'healthy';
			case 'At Risk':
				return 'warning';
			case 'Critical':
				return 'critical';
		}
	}

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
	let sortedSystems = systems;

	function sortSystems(sort: string) {
		switch (sort) {
			case 'name':
				sortedSystems.sort((a, b) => {
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
				sortedSystems.sort((a, b) => {
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
				sortedSystems.sort((a, b) => {
					if (a.status > b.status) {
						return 1 * currentOrder;
					}
					if (a.status < b.health) {
						return -1 * currentOrder;
					} 
						return 0;
					})
					break;
			case 'type':
				sortedSystems.sort((a, b) => {
					if (a.type > b.type) {
						return 1 * currentOrder;
					}
					if (a.type < b.type) {
						return -1 * currentOrder;
					} 
						return 0;
					})
					break;
			case 'check':
				sortedSystems.sort((a, b) => {
					let first = parseTime(a.lastCheck);
					let second = parseTime(b.lastCheck);

					if (first > second) {
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
			
			sortedSystems = sortedSystems;
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
										Name <!-- Name <ArrowDownUp class="w-4 h-4"/> -->
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
									<button on:click={() => {sortSystems('type')}}>
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
							{#each sortedSystems as system (system.id)}
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