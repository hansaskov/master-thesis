<script lang="ts">
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import Check from 'lucide-svelte/icons/check-check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';

	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Table from '$lib/components/ui/table';
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils';
	import { tick } from 'svelte';

	const statusTypes = ['Active', 'Offline', 'Paused'] as const;
	type StatusType = (typeof statusTypes)[number];

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
			id: 'vp1',
			name: 'VisioPointer® 1',
			status: 'Active',
			location: 'Production Line 1',
			image: '/placeholder.svg',
			lastCheck: '2 minutes ago'
		},
		{
			id: 'vc1',
			name: 'VisioCompact® 1',
			status: 'Active',
			location: 'Assembly Area A',
			image: '/placeholder.svg',
			lastCheck: '5 minutes ago'
		},
		{
			id: '360i1',
			name: '360 Inspector® 1',
			status: 'Active',
			location: 'Quality Control Station',
			image: '/placeholder.svg',
			lastCheck: '1 minute ago'
		},
		{
			id: 'si1',
			name: 'SmartInspector® 1',
			status: 'Paused',
			location: 'Packaging Line 2',
			image: '/placeholder.svg',
			lastCheck: '10 minutes ago'
		},
		{
			id: 'vp2',
			name: 'VisioPointer® 2',
			status: 'Paused',
			location: 'Production Line 2',
			image: '/placeholder.svg',
			lastCheck: '15 minutes ago'
		},
		{
			id: 'vc2',
			name: 'VisioCompact® 2',
			status: 'Active',
			location: 'Assembly Area B',
			image: '/placeholder.svg',
			lastCheck: '8 minutes ago'
		},
		{
			id: 'vp3',
			name: 'VisioPointer® 3',
			status: 'Paused',
			location: 'Production Line 2',
			image: '/placeholder.svg',
			lastCheck: '15 minutes ago'
		},
		{
			id: 'vp4',
			name: 'VisioPointer® 4',
			status: 'Offline',
			location: 'Assembly Area B',
			image: '/placeholder.svg',
			lastCheck: '5 hours ago'
		}
	];

	function handleRowClick(id: string) {
		goto(`/systems/${id}`);
	}

	// Combobox related code
	const organizations = [
		{ value: 'org1', label: 'Organization 1' },
		{ value: 'org2', label: 'Organization 2' },
		{ value: 'org3', label: 'Organization 3' },
		{ value: 'org4', label: 'Organization 4' }
	];

	let openCombobox = false;
	let selectedOrg = '';

	$: selectedOrgLabel =
		organizations.find((org) => org.value === selectedOrg)?.label ?? 'Select an organization...';

	function closeAndFocusTrigger(triggerId: string) {
		openCombobox = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Card.Root class="w-full">
	<Card.Header class="flex flex-row justify-between">
	<div>
		<Card.Title>Production Systems</Card.Title>
		<Card.Description class="flex justify-between items-start">
			Monitor and manage your production systems across different factory areas.
		</Card.Description>
	</div>
	
	<Popover.Root bind:open={openCombobox} let:ids>
		<Popover.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="outline"
				role="combobox"
				aria-expanded={openCombobox}
				class="w-[200px] justify-between"
			>
				{selectedOrgLabel}
				<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-[200px] p-0">
			<Command.Root>
				<Command.Input placeholder="Search organization..." />
				<Command.Empty>No organization found.</Command.Empty>
				<Command.Group>
					{#each organizations as org}
						<Command.Item
							value={org.value}
							onSelect={(currentValue) => {
								selectedOrg = currentValue;
								closeAndFocusTrigger(ids.trigger);
							}}
						>
							<Check class={cn('mr-2 h-4 w-4', selectedOrg !== org.value && 'text-transparent')} />
							{org.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
	</Card.Header>
	<Card.Content>
		
		<div class="overflow-x-auto">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="hidden w-[100px] md:table-cell">
							<span class="sr-only">Image</span>
						</Table.Head>
						<Table.Head>Name</Table.Head>
						<Table.Head class="hidden md:table-cell">Status</Table.Head>
						<Table.Head class="hidden md:table-cell">Location</Table.Head>
						<Table.Head class="hidden md:table-cell">Last Check</Table.Head>
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
							<Table.Cell class="font-medium">{system.name}</Table.Cell>
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
			Showing <strong>{systems.length}</strong> systems
		</div>
		<Button href="/systems" variant="outline" size="sm">
			View All Systems
			<ArrowRight class="ml-2 h-4 w-4" />
		</Button>
	</Card.Footer>
</Card.Root>