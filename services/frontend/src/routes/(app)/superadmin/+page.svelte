<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { faker } from '@faker-js/faker';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Check } from 'svelte-radix';
	import { cn } from '$lib/utils';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import AlertDialogBody from '$lib/components/AlertDialogBody.svelte';
	import PartSelector from './(components)/part-selector.svelte';
	import { type Part, partsStore } from '$lib/stores/parts.svelte';
	import { organizationStore } from '$lib/stores/organization.svelte';
	import { userStore } from '$lib/stores/user.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Ellipsis } from 'lucide-svelte';
	import { dialogStore } from '$lib/stores/dialog.svelte';
	import EditOrganizationDialogBody from '$lib/components/EditOrganizationDialogBody.svelte';
	import type { Types } from 'backend';
	import { systemStore } from '$lib/stores/systems.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import SpareParts from './SpareParts.svelte';

	let newOrganization = $state<Types.OrganizationNew>({
		name: ''
	});

	interface Model {
		name: string;
		parts: Part[];
	}

	let models: Model[] = $state([
		{
			name: 'VisioCompact® 1',
			parts: [partsStore.parts[0], partsStore.parts[1], partsStore.parts[2]]
		},
		{
			name: 'VisioPointer® 1',
			parts: [partsStore.parts[3], partsStore.parts[0]]
		}
	]);

	let newModelName = $state('');
	let selectedModel: any = $state(null);

	let newPartName = '';
	let newPartImage: any = null;
	let fileName = '';

	let openCombobox = $state(false);
	let selectedOrg = $state('');

	$inspect(selectedOrg);

	type SystemModelType = Types.SystemNew['system_model'];

	const systemModels: Array<{ value: SystemModelType; label: string }> = [
		{ value: 'VisioPointer', label: 'VisioPointer' },
		{ value: 'VisioLine', label: 'VisioLine' },
		{ value: 'SmartInspector', label: 'SmartInspector' },
		{ value: '360 Inspector', label: '360 Inspector' },
		{ value: 'VisioOne', label: 'VisioOne' },
		{ value: 'IML-Inspector', label: 'IML-Inspector' }
	];

	let selected = $state('');

	const triggerContent = $derived(
		systemModels.find((v) => v.value === selected)?.label ?? 'Select a fruit'
	);

	$inspect(selected);

	let newSystem = $state<Types.SystemNew>({
		name: '',
		organization_id: '',
		system_model: 'VisioPointer'
	});

	$effect(() => {
		newSystem.organization_id = selectedOrg;
	});

	function addPart() {
		if (newPartName && newPartImage) {
			partsStore.parts.push({
				id: partsStore.parts.length + 1,
				name: newPartName,
				image: newPartImage,
				selected: false
			});
		}
		console.log('New part added:', newPartName);
		newPartName = '';
		newPartImage = '';
	}

	function removePart(partIndex: number) {
		partsStore;
		console.log('Removed part with index: ', partIndex);
	}

	function editPart(partName: string) {
		// TODO: Implement editing parts
	}

	function addModel() {
		if (newModelName) {
			models = [
				...models,
				{
					name: newModelName,
					parts: partsStore.selectedParts
				}
			];
			newModelName = '';
			partsStore.selectedParts = [];
		}
	}

	function removeModel(index: any) {
		models = models.filter((_, i) => i !== index);
	}

	function removePartFromModel(modelIndex: number, partIndex: number) {
		models[modelIndex].parts = models[modelIndex].parts.filter((_, i) => i !== partIndex);
	}

	function toggleModel(index: any) {
		selectedModel = selectedModel === index ? null : index;
	}

	function togglePartSelection(part: Part) {
		const index = partsStore.selectedParts.findIndex((p) => p.id === part.id);
		if (index === -1) {
			partsStore.selectedParts = [...partsStore.selectedParts, part];
		} else {
			partsStore.selectedParts = partsStore.selectedParts.filter((p) => p.id !== part.id);
		}
	}

	organizationStore.refresh();
</script>

<div class="md:container">
	<h1 class="mb-6 text-3xl font-bold">Superadmin Settings</h1>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<Card.Root class="col-span-1 md:col-span-2">
			<Card.Header>
				<Card.Title>Organization Management</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="mb-6">
					<Label for="new-organization">Add New Organization</Label>
					<form
						onsubmit={(e) => {
							e.preventDefault();
							organizationStore.add(newOrganization);
							newOrganization.name = '';
						}}
						class="flex gap-2"
					>
						<Input placeholder="Enter organization name" bind:value={newOrganization.name} />
						<Button type="submit">Add Organization</Button>
					</form>
				</div>

				<Table.Root>
					<Table.Caption>List of Organizations</Table.Caption>
					<Table.Header>
						<Table.Row>
							<Table.Head>Name</Table.Head>
							<Table.Head class="text-right">Actions</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each organizationStore.organizations as organization}
							<Table.Row>
								<Table.Cell>{organization.name}</Table.Cell>
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
														title: `Update ${organization.name}`,
														description:
															'This action will update the name of the selected organization',
														component: EditOrganizationDialogBody,
														props: organization
													});
												}}
											>
												Edit Organization
											</DropdownMenu.Item>
											<DropdownMenu.Separator />
											<DropdownMenu.Item
												onclick={() => {
													dialogStore.open({
														title: 'Are you absolutely sure?',
														description:
															"This action cannot be undone. This will permanently delete the organization and all of it's systems",
														component: AlertDialogBody,
														props: { onsubmit: () => organizationStore.remove(organization) }
													});
												}}
												class="text-red-600"
											>
												Remove Organization
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

		<Card.Root class="col-span-1 md:col-span-2">
			<Card.Header>
				<Card.Title>Vision System Management</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="mb-6">
					<Label for="new-model">Add New Vision System</Label>
					<form
						onsubmit={(e) => {
							e.preventDefault();
							systemStore.add(newSystem);
						}}
					>
						<div class="space-y-4">
							<div class="flex gap-2">
								<Input placeholder="Enter name" bind:value={newSystem.name} />
								<PartSelector />
							</div>
							<Select.Root type="single" bind:value={selected}>
								<Select.Trigger class="w-[180px]">
									{triggerContent}
								</Select.Trigger>
								<Select.Content>
									<Select.Group>
										{#each systemModels as systemModel}
											<Select.Item value={systemModel.value} label={systemModel.label} >
												{systemModel.label}
											</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
							</Select.Root>
							<div>
								<Popover.Root bind:open={openCombobox}>
									<Popover.Trigger>
										<Button
											variant="outline"
											role="combobox"
											aria-expanded={openCombobox}
											class="pr-0 pl-2 font-bold sans-serif tracking-wide text-xl sm:font-medium sm:text-sm"
										>
											{#if organizationStore.currentOrganization}
												{organizationStore.currentOrganization.name}
												<ChevronsUpDown class="h-4 shrink-0 opacity-50" />
											{:else}
												<span>Select Organization</span>
												<ChevronsUpDown class="h-4 shrink-0 opacity-50" />
											{/if}
										</Button>
									</Popover.Trigger>
									<Popover.Content class="w-[170px] p-0">
										<Command.Root bind:value={selectedOrg}>
											<Command.Input placeholder="Search organizations..." />
											<Command.Empty>No organization found.</Command.Empty>
											<Command.Group>
												{#each organizationStore.organizations as org}
													<Command.Item>
														<Check
															class={cn(
																'mr-2 h-4 w-4',
																selectedOrg !== org.id && 'text-transparent'
															)}
														/>
														{org.name}
													</Command.Item>
												{/each}
											</Command.Group>
										</Command.Root>
									</Popover.Content>
								</Popover.Root>
							</div>
							<div>
								<Button type="submit">Create Vision System</Button>
							</div>
						</div>
					</form>
				</div>

				<Table.Root>
					<Table.Caption>List of Vision Systems</Table.Caption>
					<Table.Header>
						<Table.Row class="justify-between">
							<Table.Head>Name</Table.Head>
							<Table.Head class="text-right">Actions</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each models as model, modelIndex}
							<Table.Row>
								<Table.Cell>{model.name}</Table.Cell>
								<Table.Cell class="text-right">
									<Button variant="outline" size="sm" onclick={() => toggleModel(modelIndex)}>
										{selectedModel === modelIndex ? 'Hide Parts' : 'Show Parts'}
									</Button>
								</Table.Cell>
								<Table.Cell class="text-right w-[80px]">
									<Button variant="destructive" size="sm" onclick={() => removeModel(modelIndex)}>
										Remove
									</Button>
								</Table.Cell>
							</Table.Row>
							<!-- Parts List (Visible when model is selected) -->
							{#if selectedModel === modelIndex}
								<Table.Row class="bg-muted justify-between">
									<Table.Cell class="text-muted-foreground">Image</Table.Cell>
									<Table.Cell class="text-muted-foreground">Part Name</Table.Cell>
									<Table.Cell class="text-muted-foreground">Actions</Table.Cell>
								</Table.Row>
								{#each model.parts as part, partIndex}
									<Table.Row>
										<Table.Cell>
											<img
												src={part.image}
												alt={part.name}
												class="w-12 h-12 rounded-md object-cover"
											/>
										</Table.Cell>
										<Table.Cell>
											{part.name}
										</Table.Cell>
										<Table.Cell>
											<Button
												variant="destructive"
												size="sm"
												onclick={() => removePartFromModel(modelIndex, partIndex)}
											>
												Remove
											</Button>
										</Table.Cell>
									</Table.Row>
								{/each}
							{/if}
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>

		<SpareParts/>
	</div>
</div>
