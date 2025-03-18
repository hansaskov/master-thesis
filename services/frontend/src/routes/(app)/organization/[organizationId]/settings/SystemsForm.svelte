<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { Types } from 'backend';
	import { systemStore } from '@/stores/systems.svelte';
	import { systemModelStore } from '@/stores/system-models.svelte';
	import { page } from '$app/state';
	import { systemsToPartsStore } from '@/stores/systems-to-parts.svelte';

	systemModelStore.refresh();

	const defaultSystem: Types.SystemNew = {
		name: '',
		organization_id: page.params.organizationId,
		system_model: 'VisioPointer'
	};

	let newSystem = $state(defaultSystem);

	async function createVisionSystem(e: SubmitEvent) {
		e.preventDefault();

		const createdSystem = await systemStore.add(newSystem);

		if (createdSystem) {
			let system_model = systemModelStore.systemModels.filter(
				(system) => system.name === newSystem.system_model
			)[0];
			let parts: Types.Part[] = system_model.parts;

			const relations = parts.map((part) => ({
				system_id: createdSystem.id,
				parts_id: part.id
			}));

			await systemsToPartsStore.addBatch(relations);
		}

		newSystem = defaultSystem;
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Setup New Vision System</Card.Title>
		<Card.Description>Create your newly deployed vision system here</Card.Description>
	</Card.Header>
	<Card.Content>
		<form onsubmit={createVisionSystem}>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<Label for="system-name" class="text-sm font-medium">Name</Label>
					<Input placeholder="Enter system name" bind:value={newSystem.name} />
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label for="system-name" class="text-sm font-medium">Model Type</Label>
					<Select.Root type="single" bind:value={newSystem.system_model}>
						<Select.Trigger>
							{newSystem.system_model}
						</Select.Trigger>
						<Select.Content>
							{#each systemModelStore.systemModels as systemModel}
								<Select.Item value={systemModel.name} label={systemModel.name} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="md:pt-4 flex justify-end">
					<Button type="submit">Create</Button>
				</div>
			</div>
		</form>
	</Card.Content>
</Card.Root>
