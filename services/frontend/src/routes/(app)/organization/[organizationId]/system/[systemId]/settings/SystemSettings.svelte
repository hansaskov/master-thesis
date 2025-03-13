<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import type { Types } from 'backend';
	import { systemStore } from '$lib/stores/systems.svelte';
	import { page } from '$app/state';
	import { Label } from '@/components/ui/label';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';

	systemStore.refresh();

	const system = $derived(systemStore.currentSystem);

	const systemModelsTypes: Types.SystemNew['system_model'][] = [
		'VisioPointer',
		'360 Inspector',
		'IML-Inspector',
		'SmartInspector',
		'VisioCompact',
		'VisioLine',
		'VisioOne'
	];

	const defaultSystem: Types.SystemUpdate = $derived({
		id: page.params.systemId,
		name: systemStore.currentSystem?.name,
		system_model: systemStore.currentSystem?.system_model
	});

	// svelte-ignore state_referenced_locally
	let updateSystem = $state(defaultSystem);

	async function updateVisionSystem(e: SubmitEvent) {
		e.preventDefault();
		await systemStore.update(updateSystem);
		updateSystem = defaultSystem;
	}
</script>

<Card.Root class="md:col-span-1">
	<Card.Header>
		<Card.Title>Edit <span>{system?.name}</span></Card.Title>
		<Card.Description>Change the settings for your system</Card.Description>
	</Card.Header>
	<Card.Content>
		<form onsubmit={updateVisionSystem}>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<Label for="system-name" class="text-sm font-medium">Name</Label>
					<Input placeholder="Enter system name" bind:value={updateSystem.name} />
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label for="system-name" class="text-sm font-medium">Model Type</Label>
					<Select.Root type="single" bind:value={updateSystem.system_model}>
						<Select.Trigger>
							{updateSystem.system_model}
						</Select.Trigger>
						<Select.Content>
							{#each systemModelsTypes as systemModel}
								<Select.Item value={systemModel} label={systemModel} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="md:pt-4 flex justify-end">
					<Button type="submit">Update</Button>
				</div>
			</div>
		</form>
	</Card.Content>
</Card.Root>
