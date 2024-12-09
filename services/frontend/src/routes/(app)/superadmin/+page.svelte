<script lang="ts">
    import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
    import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
    import { faker } from '@faker-js/faker';
    import * as Command from "$lib/components/ui/command";
    import PartSelector from "./(components)/part-selector.svelte"
    import { type Part, partsStore } from "$lib/stores/parts.svelte"

    let newOrganization = '';
	let organizations = [
		{ id: 1, name: 'TriVision A/S' },
		{ id: 2, name: 'Vestkraft' }
	];

	function addOrganization() {
		if (newOrganization) {
			organizations = [
				...organizations,
				{ id: organizations.length + 1, name: newOrganization, }
			];
			console.log('New organization added:', newOrganization);
			newOrganization = '';
		}
	}

	function editOrganization(organizationName: string) {

	}

	function removeOrganization(organizationName: string) {
		organizations = organizations.filter((organization) => organization.name !== organizationName);
		console.log('organization removed:', organizationName);
	}

	interface Model {
		name: string;
		parts: Part[];
	}

	let models: Model[] = [
		{
			name: "VisioCompact® 1",
			parts: [partsStore.parts[0], partsStore.parts[1], partsStore.parts[2]],
		},
		{
			name: "VisioPointer® 1",
			parts: [partsStore.parts[3], partsStore.parts[0]],
		}
	]

	let newModelName = '';
	let selectedModel: any = null;


	let newPartName = '';
	let newPartImage: any = null;
	let fileName = "";
	
	function addPart() {
		if (newPartName && newPartImage) {
			partsStore.parts.push({ id: partsStore.parts.length+1, name: newPartName, image: newPartImage, selected: false });
		}
		console.log('New part added:', newPartName);
		newPartName = '';
		newPartImage = '';
	}
	
	function removePart(partIndex: number) {
		partsStore
		console.log('Removed part with index: ', partIndex);
	}
	
	function editPart(partName: string) {
		// TODO: Implement editing parts
	}

	function addModel() {
		if (newModelName) {
			models = [...models, { 
				name: newModelName, 
				parts: partsStore.selectedParts
			}];
			newModelName = "";
			partsStore.selectedParts = [];
    	}
  	}

	function removeModel(index: any) {
    	models = models.filter((_, i) => i !== index);
  	}

	function removePartFromModel(modelIndex: number, partIndex: number) {
		models[modelIndex].parts = models[modelIndex].parts.filter((_, i) => i !== partIndex)
	}

	function toggleModel(index: any) {
    	selectedModel = selectedModel === index ? null : index;
  	}

	function togglePartSelection(part: Part) {
    	const index = partsStore.selectedParts.findIndex(p => p.id === part.id);
		if (index === -1) {
			partsStore.selectedParts = [...partsStore.selectedParts, part];
		} else {
			partsStore.selectedParts = partsStore.selectedParts.filter(p => p.id !== part.id);
		}
	}
</script>

<h1 class="mb-6 text-3xl font-bold">Superadmin Settings</h1>
<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <Card.Root class="col-span-1 md:col-span-2">
        <Card.Header>
            <Card.Title>Organization Management</Card.Title>
        </Card.Header>
        <Card.Content>
            <div class="mb-6">
                <Label for="new-organization">Add New Organization</Label>
                <div class="flex gap-2">
                    <Input placeholder="Enter organization name" bind:value={newOrganization} />
                    <Button type="submit" on:click={addOrganization}>Add Organization</Button>
                </div>
            </div>

            <Table.Root>
                <Table.Caption>List of Organizations</Table.Caption>
                <Table.Header>
                    <Table.Row>
                        <Table.Head class="w-[300px]">ID</Table.Head>
                        <Table.Head>Name</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#each organizations as organization}
                        <Table.Row>
                            <Table.Cell>{organization.id}</Table.Cell>
                            <Table.Cell>{organization.name}</Table.Cell>
                            <Table.Cell class="text-right">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    on:click={() => editOrganization(organization.name)}
                                >
                                    Edit
                                </Button>
                            </Table.Cell>
                            <Table.Cell class="text-right w-[80px]">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    on:click={() => removeOrganization(organization.name)}
                                >
                                    Remove
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    {/each}
                </Table.Body>
            </Table.Root>
        </Card.Content>
    </Card.Root>

    <Card.Root class="col-span-1 md:col-span-2">
        <Card.Header>
            <Card.Title>Production System Management</Card.Title>
        </Card.Header>
        <Card.Content>
            <div class="mb-6">
                <Label for="new-model">Add New Production System</Label>
                <div class="space-y-4">
                    <div class="flex gap-2">
                        <Input placeholder="Enter name" bind:value={newModelName} />
                        <PartSelector /> 
                    </div>

                    <Button type="submit" on:click={addModel}>
                        Create Production System
                    </Button>
                </div>
            </div>

            <Table.Root>
                <Table.Caption>List of Production Systems</Table.Caption>
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
                                <Button
                                    variant="outline"
                                    size="sm"
                                    on:click={() => toggleModel(modelIndex)}
                                >
                                    {selectedModel === modelIndex ? 'Hide Parts' : 'Show Parts'}
                                </Button>
                            </Table.Cell>
                            <Table.Cell class="text-right w-[80px]">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    on:click={() => removeModel(modelIndex)}
                                >
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
                                            on:click={() => removePartFromModel(modelIndex, partIndex)}
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

    <Card.Root class="col-span-1 md:col-span-2">
        <Card.Header>
            <Card.Title>Vision System Spare Parts</Card.Title>
        </Card.Header>
        <Card.Content>
            <div class="mb-6">
                <Label for="new-organization">Add New Spare Part</Label>
                <div class="flex gap-2">
                    <Input placeholder="Enter spare part name" bind:value={partsStore.newPart.name} />
                    <div class="file-input-wrapper relative">
                        <label for="file-upload" class="file-input-label block">
                            <span class="bg-gray-100 px-4 py-4 rounded cursor-pointer border border-gray-300 hover:bg-gray-200 h-9 flex items-center justify-center w-32">
                            Image
                            </span>
                        </label>
                        <Input
                            id="file-upload"
                            type="file"
                            accept=".jpg, .jpeg, .png, .webp"
                            class="hidden"
                        />
                        {#if fileName}
                            <p class="text-gray-600 mt-2 text-sm truncate">{fileName}</p>
                        {/if}
                    </div>
                    <Button type="submit" on:click={partsStore.addPart}>Add Part</Button>
                </div>
            </div>

            <Table.Root>
                <Table.Caption>List of Spare Parts</Table.Caption>
                <Table.Header>
                    <Table.Row>
                        <Table.Head class="w-[300px]">ID</Table.Head>
                        <Table.Head>Name</Table.Head>
                        <Table.Head>Image</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#each partsStore.parts as part, partIndex}
                        <Table.Row>
                            <Table.Cell>{part.id}</Table.Cell>
                            <Table.Cell>{part.name}</Table.Cell>
                            <Table.Cell>
                                <img
                                alt="{part.name} image"
                                class="aspect-square rounded-md object-cover"
                                height="64"
                                width="64"
                                src={part.image}
                            />
                            </Table.Cell>
                            <Table.Cell class="text-right">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    on:click={() => editPart(part.name)}
                                >
                                    Edit
                                </Button>
                            </Table.Cell>
                            <Table.Cell class="text-right w-[80px]">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    on:click={() => removePart(partIndex)}
                                >
                                    Remove
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    {/each}
                </Table.Body>
            </Table.Root>
        </Card.Content>
    </Card.Root>
</div>