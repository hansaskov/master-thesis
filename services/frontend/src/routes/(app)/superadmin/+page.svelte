<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Check } from 'svelte-radix';
	import { cn } from '$lib/utils';
	import AlertDialogBody from '$lib/components/AlertDialogBody.svelte';
	import PartSelector from './(components)/part-selector.svelte';
	import { partsStore } from '$lib/stores/parts.svelte';
	import { organizationStore } from '$lib/stores/organization.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Ellipsis } from 'lucide-svelte';
	import { dialogStore } from '$lib/stores/dialog.svelte';
	import EditOrganizationDialogBody from '$lib/components/EditOrganizationDialogBody.svelte';
	import type { Types } from 'backend';
	import { systemStore } from '$lib/stores/systems.svelte';
	import SpareParts from './SpareParts.svelte';
	import { systemModelStore } from '$lib/stores/system-models.svelte';
	import CaretSort from 'svelte-radix/CaretSort.svelte';
	import { Title } from 'chart.js';
	import { Description } from '$lib/components/ui/alert';
	import { toast } from "svelte-sonner";
	import { page } from "$app/state";
	import { partsToSystemModelStore } from '$lib/stores/parts-to-system-models.svelte';

	let selectedParts = $state<Types.Part[]>([]);
	let removedParts = $state<Types.Part[]>([]);
	$inspect(selectedParts);

	$inspect(removedParts);

	async function updateAllRelations(system_model_id: string) {
		for (const part of selectedParts) {
       		await partsToSystemModelStore.add({part_id: part.id, system_model_id});
    	}
		for (const part of removedParts) {
        	await partsToSystemModelStore.delete({part_id: part.id, system_model_id});
    	}
		selectedParts = [];
		removedParts = [];
		await systemModelStore.refresh();
		await partsStore.refresh();
	}

	function togglePartSelection(part: Types.Part, checked: boolean) {
		if (checked) {
			selectedParts = [...selectedParts, part];
			removedParts = removedParts.filter(p => p !== part);
		} else {
			removedParts = [...removedParts, part];
			selectedParts = selectedParts.filter(p => p !== part);
		}
    }

	function isPartInSystemModel(part: Types.Part, model_parts: Types.Part[]): boolean {
		return model_parts.some(modelPart => modelPart.id === part.id);
    }

	function getUniqueParts(dataParts: Types.Part[], allParts: Types.Part[]) {
		return allParts.filter((part) => !dataParts.some((dp) => dp.id === part.id));
	}

	let newOrganization = $state<Types.OrganizationNew>({
		name: ''
	});

	let selectedModel: number | null = $state(null);
	let selectedOrg = $state('');

	$inspect(selectedOrg);

	type SystemModelType = Types.SystemNew['system_model'];

	let selectedType = $state<SystemModelType>('VisioPointer');

	$inspect(selectedType);

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
	function toggleEdit(index: number) {
		selectedEdit = selectedEdit === index ? null : index;
	}

	organizationStore.refresh();
	systemModelStore.refresh();
</script>

<div class="md:container">
	<h1 class="mb-6 text-3xl font-bold">Superadmin Settings</h1>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<Card.Root class="col-span-1 md:col-span-2">
			<Card.Header>
				<Card.Title>List of Superadmins</Card.Title>
			</Card.Header>
			<Card.Content></Card.Content>
		</Card.Root>

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
												<Button variant="outline" size="sm" onclick={() => toggleEdit(index)}>
													{selectedEdit === index ? 'Save' : 'Edit'}
												</Button>
												<Button variant="outline" size="sm" onclick={() => toggleModel(index)}>
													{selectedModel === index ? 'Hide Parts' : 'Show Parts'}
												</Button>
											</Table.Cell>
										</Table.Row>
										<!-- Parts List (Visible when model is selected) -->
										{#if selectedModel === index}
											{#if data.parts && data.parts.length > 0}
												<Table.Row class="bg-muted justify-between">
													<Table.Cell class="text-muted-foreground">Part Name</Table.Cell>
													<Table.Cell class="text-muted-foreground"></Table.Cell>
													<Table.Cell class="text-muted-foreground text-right">Image</Table.Cell>
												</Table.Row>
												{#each data.parts as part}
													<Table.Row>
														<Table.Cell class="text-left">
															{#if selectedEdit === index}
																<Checkbox checked={selectedParts.includes(part) || isPartInSystemModel(part, data.parts)}
																onCheckedChange= {(value) => togglePartSelection(part, value)}/>
															{/if}
															{part.name}
														</Table.Cell>
														<Table.Cell></Table.Cell>
														<Table.Cell>{part.image}</Table.Cell>
													</Table.Row>
												{/each}
												{#if selectedEdit === index}
													{#each getUniqueParts(data.parts, partsStore.parts) as part}
														<Table.Row>
															<Table.Cell>
																<Checkbox checked={selectedParts.includes(part) || isPartInSystemModel(part, data.parts)}
																onCheckedChange= {(value) => togglePartSelection(part, value)}/>
																{part.name}
															</Table.Cell>
															<Table.Cell>
																{part.image}
															</Table.Cell>
														</Table.Row>
													{/each}
												{/if}
											{/if}
										{/if}
										<!-- {#if selectedEdit === index}
											<Table.Root>
												<Table.Header>
													<Table.Row class="justify-between">
														<Table.Head>Part Name</Table.Head>
													</Table.Row>
												</Table.Header>
												<Table.Body>
												{#each partsStore.parts as part}
													<Table.Row>
														<Table.Cell>
															<Checkbox 
																checked={selectedParts.includes(part) || isPartInSystemModel(part, data.parts)}
																onCheckedChange= {(value) => togglePartSelection(part, value)}/>
															{part.name}
														</Table.Cell>
													</Table.Row>
												{/each}
												<Table.Row>
													<Table.Cell>
														<Button variant="default" size="sm" onclick={() => updateAllRelations(data.id)}>
															Update Parts
														</Button>
													</Table.Cell>
												</Table.Row>
												</Table.Body>
											</Table.Root>
										{/if} -->
									{/each}
								</Table.Body>
							</Table.Root>
						</div>
				</div>
			</Card.Content>
		</Card.Root>

		<SpareParts />
	</div>
</div>
