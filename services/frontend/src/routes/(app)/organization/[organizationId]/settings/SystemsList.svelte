<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { systemStore } from '@/stores/systems.svelte';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import { dialogStore } from '@/stores/dialog.svelte';
	import AlertDialogBody from '$lib/components/AlertDialogBody.svelte';

	async function deleteVisionSystem(visionId: string) {
		systemStore.delete({ id: visionId });
	}

	systemStore.selectAll();
</script>

<Card.Root class="col-span-1 md:col-span-2">
	<Card.Header>
		<Card.Title>Manage Your Vision Systems</Card.Title>
		<Card.Description>View and manage you current vision systems.</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if systemStore.systems.length > 0}
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>System Name</Table.Head>
						<Table.Head>Vision Model</Table.Head>
						<Table.Head class="text-right">Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each systemStore.systems as system (system.id)}
						<Table.Row>
							<Table.Cell>{system.name}</Table.Cell>
							<Table.Cell>{system.system_model}</Table.Cell>
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
													title: `Are you absolutely sure? `,
													description: `This action cannot be undone. This will permanently delete "${system.name}" and all of it's readings and settings`,
													component: AlertDialogBody,
													props: { onsubmit: () => deleteVisionSystem(system.id) }
												});
											}}
											class="text-red-600"
										>
											Delete
										</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		{:else}
			<p class="mt-4 text-center text-muted-foreground">No vision systems added</p>
		{/if}
	</Card.Content>
</Card.Root>
