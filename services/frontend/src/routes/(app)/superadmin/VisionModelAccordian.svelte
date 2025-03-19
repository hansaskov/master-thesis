<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as Avatar from '$lib/components/ui/avatar';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { type SystemModelWithParts } from '$lib/stores/system-models.svelte';
	import { Button } from '@/components/ui/button';
	import type { Types } from 'backend';
	import { combineArraysAndAddIsCheckedForDublicates } from '@/transformation';
	import { systemModelStore } from '$lib/stores/system-models.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { dialogStore } from '@/stores/dialog.svelte';
	import AlertDialogBody from '$lib/components/AlertDialogBody.svelte';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';

	async function deleteSystemModel(id: string) {
		
	}

	const { model, allParts }: { model: SystemModelWithParts; allParts: Types.Part[] } = $props();

	let derivedParts = $state(combineArraysAndAddIsCheckedForDublicates(model.parts, allParts));

	$effect(() => {
		derivedParts = combineArraysAndAddIsCheckedForDublicates(model.parts, allParts);
	});

	$inspect(derivedParts);

	type Mode = 'edit' | 'save';

	let mode = $state<Mode>('edit');

	async function toggleMode() {
		if (mode === 'edit') {
			mode = 'save';
			return;
		}

		if (mode === 'save') {
			await systemModelStore.assignParts({
				system_model_id: model.id,
				part_ids: derivedParts.filter((part) => part.isChecked).map((part) => part.id)
			});
			mode = 'edit';
			return;
		}
	}
</script>

<Accordion.Item value={model.name}>
	<div class="flex items-center gap-2"> <!-- Add this container with flexbox -->
		<Avatar.Root>
		  <Avatar.Image src={model.image} alt={model.name} />
		  <Avatar.Fallback class="uppercase">{model.name.slice(0, 2)}</Avatar.Fallback>
		</Avatar.Root>
		<Accordion.Trigger>{model.name}</Accordion.Trigger>
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
							description: `This action cannot be undone. This will permanently delete "${model.name}" and all of it's readings and settings`,
							component: AlertDialogBody,
							props: { onsubmit: () => deleteSystemModel(model.id) }
						});
					}}
					class="text-red-600"
				>
					Delete
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
	
	<Accordion.Content>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head hidden={mode == 'edit'} class="w-[50px]"></Table.Head>
					<Table.Head>Name</Table.Head>
					<Table.Head class="text-right">Picture</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each derivedParts as part}
					{#if mode === 'save' || part.isChecked === true}
						<Table.Row>
							<Table.Cell hidden={mode == 'edit'} class="w-[50px]">
								<Checkbox bind:checked={part.isChecked}></Checkbox>
							</Table.Cell>
							<Table.Cell>{part.name}</Table.Cell>
							<Table.Cell class="flex justify-end">
								<Avatar.Root>
									<Avatar.Image src={part.image} alt={part.name} />
									<Avatar.Fallback class="uppercase">{part.name.slice(0, 2)}</Avatar.Fallback>
								</Avatar.Root>
							</Table.Cell>
						</Table.Row>
					{/if}
				{/each}
			</Table.Body>
		</Table.Root>
		<div class="flex items-center justify-end space-x-2 pt-4">
			<div class="space-x-2">
				<Button variant="outline" size="sm" class="capitalize" onclick={toggleMode}>{mode}</Button>
			</div>
		</div>
	</Accordion.Content>
</Accordion.Item>
