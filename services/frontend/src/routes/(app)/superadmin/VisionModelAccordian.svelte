<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as Avatar from '$lib/components/ui/avatar';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { type SystemModelWithParts } from '$lib/stores/system-models.svelte';
	import { Button } from '@/components/ui/button';
	import type { Types } from 'backend';

	const { model, allParts }: { model: SystemModelWithParts; allParts: Types.Part[] } = $props();

	function combineArrays<T extends { id: string }>(arr1: T[], arr2: T[]) {
		const idMap = new Map<string, T & { isDuplicate: boolean }>();

		// Process both arrays
		for (const item of [...arr1, ...arr2]) {
			const existing = idMap.get(item.id);

			if (existing) {
				// If this ID already exists, mark both as duplicates
				existing.isDuplicate = true;
				// We don't add the new item since we're keeping only one instance per ID
			} else {
				// First time seeing this ID
				idMap.set(item.id, { ...item, isDuplicate: false });
			}
		}

		return Array.from(idMap.values());
	}

	const derivedParts = $derived(combineArrays(model.parts, allParts));

	type Mode = 'edit' | 'save';

	let mode = $state<Mode>('edit');

	function toggleMode() {
		if (mode === 'edit') {
			mode = 'save';
		} else {
			mode = 'edit';
		}
	}
</script>

<Accordion.Item value={model.name}>
	<Accordion.Trigger>{model.name}</Accordion.Trigger>
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
					{#if mode === 'save' || part.isDuplicate === true}
						<Table.Row>
							<Table.Cell hidden={mode == 'edit'} class="w-[50px]">
								<Checkbox checked={part.isDuplicate}></Checkbox>
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
