<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import type { Types } from 'backend';
	import { systemStore } from '@/stores/systems.svelte';
	import { page } from '$app/state';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import { dialogStore } from '@/stores/dialog.svelte';
	import AlertDialogBody from '$lib/components/AlertDialogBody.svelte';

	const systemModelsTypes: Types.SystemNew['system_model'][] = [
		'VisioPointer',
		'360 Inspector',
		'IML-Inspector',
		'SmartInspector',
		'VisioCompact',
		'VisioLine',
		'VisioOne'
	];

	const defaultSystem: Types.SystemNew = {
		name: '',
		organization_id: page.params.organizationId,
		system_model: 'VisioPointer'
	};

	let newSystem = $state(defaultSystem);

	async function createVisionSystem(e: SubmitEvent) {
		e.preventDefault();
		systemStore.add(newSystem);
		newSystem = defaultSystem;
	}

	async function deleteVisionSystem(visionId: string) {
		systemStore.delete({ id: visionId });
	}

	// Update System store.
	systemStore.selectAll();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Production Systems</Card.Title>
	</Card.Header>
	<Card.Content>
		<form onsubmit={createVisionSystem} class="space-y-4">
			<div class="grid w-full gap-1.5">
				<Label for="system-name" class="text-sm font-medium">New Vision System</Label>
				<div class="flex gap-3">
					<Input
						id="system-name"
						placeholder="Enter system name"
						bind:value={newSystem.name}
						class="flex-1"
					/>
					<Select.Root type="single" bind:value={newSystem.system_model}>
						<Select.Trigger class="w-[200px]">
							{newSystem.system_model}
						</Select.Trigger>
						<Select.Content>
							{#each systemModelsTypes as systemModel}
								<Select.Item value={systemModel} label={systemModel} />
							{/each}
						</Select.Content>
					</Select.Root>
					<Button type="submit">Add System</Button>
				</div>
			</div>
		</form>
		{#if systemStore.systems.length > 0}
			<Table.Root>
				<Table.Caption>Existing Vision Systems</Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Head>System Name</Table.Head>
						<Table.Head class="text-right">Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each systemStore.systems as system (system.id)}
						<Table.Row>
							<Table.Cell>{system.name}</Table.Cell>
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
			<p class="mt-4 text-center text-muted-foreground">No vision systems added yet.</p>
		{/if}
	</Card.Content>
</Card.Root>
