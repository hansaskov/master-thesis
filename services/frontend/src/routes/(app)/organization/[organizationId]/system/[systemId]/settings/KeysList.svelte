<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { keysStore } from './keys.svelte';
	import { Button } from '@/components/ui/button';
	import { Ellipsis } from 'lucide-svelte';
	import { dialogStore } from '@/stores/dialog.svelte';
	import AlertDialogBody from '$lib/components/AlertDialogBody.svelte';
	import KeysForm from './KeysForm.svelte';
	import { getRelativeTimeString } from '@/dates';

	keysStore.fetch();
</script>

<Card.Root class="md:col-span-2">
	<Card.Header>
		<Card.Title>API Keys</Card.Title>
		<Card.Description>Create and manage API keys for your production system</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if !keysStore.isEmpty}
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head>Created</Table.Head>
						<Table.Head class="text-right">actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each keysStore.keys as { id, name, created_at }}
						<Table.Row>
							<Table.Cell>{name}</Table.Cell>
							<Table.Cell>{getRelativeTimeString(created_at)}</Table.Cell>
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
													props: { onsubmit: () => keysStore.delete({ id: id }) }
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
			<div
				class="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50"
			>
				<div class="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
					<h3 class="mt-4 text-lg font-semibold">No API keys created</h3>
					<p class="mb-4 mt-2 text-sm text-muted-foreground">
						You haven't created any API keys yet. Create one to get started.
					</p>
					<Button
						onclick={() => {
							dialogStore.open({
								title: `Create a new Api Key`,
								description:
									'This action will create a new api key the name of the selected organization',
								component: KeysForm,
								props: {}
							});
						}}
					>
						Create API Key
					</Button>
				</div>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
