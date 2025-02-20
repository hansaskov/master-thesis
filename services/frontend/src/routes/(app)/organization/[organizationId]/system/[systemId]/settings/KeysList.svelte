<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { keysStore } from './keys.svelte';
	import { Button } from '@/components/ui/button';
	import { Ellipsis } from 'lucide-svelte';
	import { dialogStore } from '@/stores/dialog.svelte';
	import AlertDialogBody from '$lib/components/AlertDialogBody.svelte';
</script>

<Card.Root class="md:col-span-2">
	<Card.Header>
		<Card.Title>API Keys</Card.Title>
		<Card.Description>Create and manage API keys for your production system</Card.Description>
	</Card.Header>
	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head>Token</Table.Head>
					<Table.Head>Created</Table.Head>
					<Table.Head class="text-right">actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each keysStore.keys as { id, name, public_key, created_at }}
					<Table.Row>
						<Table.Cell>{name}</Table.Cell>
						<Table.Cell>{public_key}</Table.Cell>
						<Table.Cell>{created_at}</Table.Cell>
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
												description: `This action cannot be undone. This will permanently delete "${name}" and all of it's readings and settings`,
												component: AlertDialogBody,
												props: { onsubmit: () => keysStore.delete({id: id}) }
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
	</Card.Content>
</Card.Root>
