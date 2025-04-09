<script lang="ts">
	// import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import ArrowDownUp from 'lucide-svelte/icons/arrow-down-up';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { goto } from '$app/navigation';

	import { systemStore } from '$lib/stores/systems.svelte';
	import { userStore } from '$lib/stores/user.svelte';
	import { organizationStore } from '$lib/stores/organization.svelte';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { Button } from '@/components/ui/button';
	import { getRelativeTimeString } from '@/dates';

	systemStore.refresh();

	const headers: { label: string }[] = [
		{ label: 'Name' },
		{ label: 'Health' },
		{ label: 'Status' },
		{ label: 'Location' },
		{ label: 'Last Check' }
	];

	// pagination
	let pageSize = 10;
	let currentPage = $state(0);
	let startIndex = $derived(currentPage * pageSize);
	let endIndex = $derived((currentPage + 1) * pageSize);
	let visibleSystems = $derived(systemStore.systems.slice(startIndex, endIndex));
	let totalSystems = $derived(systemStore.systems.length);
	let totalPages = $derived(Math.ceil(totalSystems / pageSize));

	function prevPage() {
		if (currentPage > 0) {
			currentPage--;
		}
	}

	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
		}
	}
</script>

<div class="md:container">
	<Card.Root class="w-full">
		<Card.Header class="flex gap-4 md:flex-row justify-between">
			<div>
				<Card.Title>Hello {userStore.user?.name}</Card.Title>
				<Card.Description>
					Monitor and manage your vision systems across different factory areas.
				</Card.Description>
			</div>
		</Card.Header>
		<Card.Content>
			<div class="overflow-x-auto">
				<Table.Root>
					<Table.Caption>
						<Button variant="outline" onclick={() => prevPage()} disabled={currentPage === 0}>
							<ChevronLeft class="w-2 h-2" />
						</Button>
						Showing {visibleSystems.length ? startIndex + 1 : 0}–{visibleSystems.length
							? startIndex + visibleSystems.length
							: 0}
						of {totalSystems} results
						<Button
							variant="outline"
							onclick={() => nextPage()}
							disabled={currentPage + 1 === totalPages}
						>
							<ChevronRight class="w-2 h-2" />
						</Button>
					</Table.Caption>
					<Table.Header>
						<Table.Row>
							{#each headers as { label }, i}
								<Table.Head class={i > 3 ? 'hidden md:table-cell' : ''}>
									<button>
										{label}
										<ArrowDownUp class="w-3 h-3 inline-block ml-1" />
									</button>
								</Table.Head>
							{/each}
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each visibleSystems as system (system.id)}
							<!-- TODO: Load image matching the system model type. Get status based on recent readings  -->
							<Table.Row
								onclick={() =>
									goto(`./${organizationStore.currentOrganization?.id}/system/${system.id}`)}
								class="hover:bg-muted cursor-pointer"
							>
								<Table.Cell class="font-medium">{system.name}</Table.Cell>
								<Table.Cell>
									{#if !system.latest_readings}
										<Badge variant="warning">unknown</Badge>
									{:else if system.latest_readings.every((v) => v.healthy)}
										<Badge variant="healthy">healthy</Badge>
									{:else}
										<Badge variant="destructive">critical</Badge>
									{/if}
								</Table.Cell>
								<Table.Cell>
									{#if !system.latest_readings}
										<Badge variant="warning">unknown</Badge>
									{:else if system.latest_readings.some((v) => v.running)}
										<Badge variant="secondary">online</Badge>
									{:else}
										<Badge variant="outline">offline</Badge>
									{/if}
								</Table.Cell>
								<!-- TODO: Update based on database zone -->
								<Table.Cell class="hidden md:table-cell">Zone 1</Table.Cell>
								<!-- TODO: Make dynamic -->

								<Table.Cell class="hidden md:table-cell">
									{#if !system.latest_readings}
										unknown
									{:else}
										{getRelativeTimeString(
											system.latest_readings
												.map((v) => new Date(v.bucket))
												.sort((a, b) => a.getTime() - b.getTime())[0]
										)}
									{/if}
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		</Card.Content>
	</Card.Root>
</div>
