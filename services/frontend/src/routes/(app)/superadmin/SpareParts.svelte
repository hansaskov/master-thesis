<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { Types } from 'backend';
	import { partsStore } from '$lib/stores/parts.svelte';
	import { Ellipsis } from 'lucide-svelte';
	import { dialogStore } from '$lib/stores/dialog.svelte';
	import AlertDialogBody from '$lib/components/AlertDialogBody.svelte';
	import EditPartDialogBody from '$lib/components/EditPartDialogBody.svelte';

	partsStore.refresh();

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
			<Table.Caption>List of Spare Parts</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head class="text-right">Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each partsStore.parts as part}
					<Table.Row>
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
												description:
													'This action will update the name of the selected organization',
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
