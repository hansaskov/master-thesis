<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { Types } from 'backend';
	import { partsStore } from '$lib/stores/parts.svelte';
	import { Ellipsis, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { dialogStore } from '$lib/stores/dialog.svelte';
	import AlertDialogBody from '$lib/components/AlertDialogBody.svelte';
	import EditPartDialogBody from '$lib/components/EditPartDialogBody.svelte';

	partsStore.refresh();
	
	// parts pagination
	let pageSize = 10;
	let currentPage = $state(0);
    let startIndex = $derived(currentPage * pageSize);
	let endIndex = $derived((currentPage+1) * pageSize);
	let visibleParts = $derived(partsStore.parts.slice(startIndex, endIndex));
    let totalItems = $derived(partsStore.parts.length);
    let totalPages = $derived(Math.ceil(totalItems / pageSize));

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

	let newPart = $state<Types.PartNew>({
		name: ''
	});

	function add(e: SubmitEvent) {
		e.preventDefault();
		partsStore.add(newPart);
		newPart = {
			name: ''
		};
	}
</script>

<Card.Root class="col-span-1 md:col-span-2">
	<Card.Header>
		<Card.Title>Vision System Spare Parts</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="mb-6">
			<Label for="new-part">Add New Spare Part</Label>
			<form class="flex gap-2" onsubmit={add}>
				<Input placeholder="Enter spare part name" bind:value={newPart.name} />
				<Button type="submit">Add Part</Button>
			</form>
		</div>

		<Table.Root>
			<Table.Caption>
				<Button
                        variant="outline"
                        onclick={() => prevPage()}
                        disabled={currentPage === 0}
                    >
                    <ChevronLeft class="w-2 h-2" />
                </Button>
                Showing {startIndex+1}–{startIndex + visibleParts.length}
                  of {totalItems} results
                <Button
                        variant="outline"
                        onclick={() => nextPage()}
                        disabled={currentPage+1 === totalPages}
                    >
                    <ChevronRight class="w-2 h-2" />
                </Button>
			</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>Image</Table.Head>
					<Table.Head>Name</Table.Head>
					<Table.Head class="text-right">Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each visibleParts as part}
					<Table.Row>
						<Table.Cell>{part.image}</Table.Cell>
						<Table.Cell>{part.name}</Table.Cell>
						<Table.Cell class="text-right">
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<Button variant="ghost" size="icon">
										<Ellipsis class="h-4 w-4" />
										<span class="sr-only">Open menu</span>
									</Button>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									<DropdownMenu.Label>Actions</DropdownMenu.Label>
									<DropdownMenu.Separator />
									<DropdownMenu.Item
										onclick={() => {
											dialogStore.open({
												title: `Update ${part.name}`,
												description: 'This action will update the name of the selected part',
												component: EditPartDialogBody,
												props: part
											});
										}}
									>
										Edit Part
									</DropdownMenu.Item>
									<DropdownMenu.Separator />
									<DropdownMenu.Item
										onclick={() => {
											dialogStore.open({
												title: 'Are you absolutely sure?',
												description: 'This action cannot be undone',
												component: AlertDialogBody,
												props: { onsubmit: () => partsStore.remove(part) }
											});
										}}
										class="text-red-600"
									>
										Remove Part
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
