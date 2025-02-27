<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { systemModelStore } from '$lib/stores/system-models.svelte';
	import type { Types } from 'backend';
	import { partsToSystemModelStore } from '$lib/stores/parts-to-system-models.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { partsStore } from '$lib/stores/parts.svelte';
	import * as Avatar from '$lib/components/ui/avatar';

	let selectedParts = $state<Types.Part[]>([]);
	let removedParts = $state<Types.Part[]>([]);
	$inspect(selectedParts);

	$inspect(removedParts);

	async function updateAllRelations(system_model_id: string) {
		await partsToSystemModelStore.batchUpdate({
			additions: selectedParts.map((part) => ({
				part_id: part.id,
				system_model_id
			})),
			deletions: removedParts.map((part) => ({
				part_id: part.id,
				system_model_id
			}))
		});

		selectedParts = [];
		removedParts = [];

		await Promise.all([systemModelStore.refresh(), partsStore.refresh()]);
	}

	function togglePartSelection(part: Types.Part, checked: boolean) {
		if (checked) {
			selectedParts = [...selectedParts, part];
			removedParts = removedParts.filter((p) => p !== part);
		} else {
			removedParts = [...removedParts, part];
			selectedParts = selectedParts.filter((p) => p !== part);
		}
	}

	function isPartInSystemModel(part: Types.Part, model_parts: Types.Part[]): boolean {
		return model_parts.some((modelPart) => modelPart.id === part.id);
	}

	function getUniqueParts(dataParts: Types.Part[], allParts: Types.Part[]) {
		return allParts.filter((part) => !dataParts.some((dp) => dp.id === part.id));
	}

	let selectedModel: number | null = $state(null);
	let selectedOrg = $state('');

	type SystemModelType = Types.SystemNew['system_model'];

	let selectedType = $state<SystemModelType>('VisioPointer');

	let newSystem = $state<Types.SystemNew>({
		name: '',
		organization_id: '',
		system_model: 'VisioPointer'
	});

	$effect(() => {
		newSystem.organization_id = selectedOrg;
	});

	$effect(() => {
		newSystem.system_model = selectedType;
	});

	function toggleModel(index: number) {
		selectedModel = selectedModel === index ? null : index;
	}

	let selectedEdit: number | null = $state(null);
	function toggleEdit(index: number, system_model_id: string) {
		if (selectedModel === index) {
			updateAllRelations(system_model_id);
		}
		selectedEdit = selectedEdit === index ? null : index;
	}

	systemModelStore.refresh();
</script>

<Card.Root class="col-span-1 md:col-span-2">
	<Card.Header>
		<Card.Title>Vision System Management</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="mb-6">
			<Label for="new-model">Name of Vision Systems</Label>
			<div class="space-y-4">
				<Table.Root>
					<Table.Caption>List of Vision Systems</Table.Caption>
					<Table.Header>
						<Table.Row class="justify-between">
							<Table.Head>Name</Table.Head>
							<Table.Head></Table.Head>
							<Table.Head class="text-right">Actions</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each systemModelStore.systemModels as data, index}
							<Table.Row onclick={() => (selectedType = data.name)}>
								<Table.Cell>{data.name}</Table.Cell>
								<Table.Cell></Table.Cell>
								<Table.Cell class="justify-end flex gap-4">
									{#if selectedModel === index}
										<Button variant="outline" size="sm" onclick={() => toggleEdit(index, data.id)}>
											{selectedEdit === index ? 'Save' : 'Edit'}
										</Button>
									{/if}
									<Button variant="outline" size="sm" onclick={() => toggleModel(index)}>
										{selectedModel === index ? 'Hide Parts' : 'Show Parts'}
									</Button>
								</Table.Cell>
							</Table.Row>
							<!-- Parts List (Visible when model is selected) -->
							{#if selectedModel === index}
								<Table.Row class="bg-muted justify-between">
									<Table.Cell class="text-muted-foreground">Part Name</Table.Cell>
									<Table.Cell class="text-muted-foreground"></Table.Cell>
									<Table.Cell class="text-muted-foreground text-right">Image</Table.Cell>
								</Table.Row>
								{#each data.parts as part}
									<Table.Row class="text-xs">
										<Table.Cell class="text-left">
											{#if selectedEdit === index}
												<Checkbox
													checked={selectedParts.includes(part) ||
														isPartInSystemModel(part, data.parts)}
													onCheckedChange={(value) => togglePartSelection(part, value)}
												/>
											{/if}
											{part.name}
										</Table.Cell>
										<Table.Cell></Table.Cell>
										<Table.Cell>
											<div class="flex justify-end w-full">
												<Avatar.Root>
													<Avatar.Image src={part.image} alt="part-image"/>
													<Avatar.Fallback>No image</Avatar.Fallback>
												</Avatar.Root>
											</div>
										</Table.Cell>
									</Table.Row>
								{/each}
								{#if selectedEdit === index}
									{#each getUniqueParts(data.parts, partsStore.parts.current) as part}
										<Table.Row class="text-xs">
											<Table.Cell>
												<Checkbox
													checked={selectedParts.includes(part) ||
														isPartInSystemModel(part, data.parts)}
													onCheckedChange={(value) => togglePartSelection(part, value)}
												/>
												{part.name}
											</Table.Cell>
											<Table.Cell></Table.Cell>
											<Table.Cell class="text-right">
												<div class="flex justify-end w-full">
													<Avatar.Root>
														<Avatar.Image src={part.image} alt="part-image"/>
														<Avatar.Fallback>No image</Avatar.Fallback>
													</Avatar.Root>
												</div>
											</Table.Cell>
										</Table.Row>
									{/each}
								{/if}
							{/if}
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		</div>
	</Card.Content>
</Card.Root>
