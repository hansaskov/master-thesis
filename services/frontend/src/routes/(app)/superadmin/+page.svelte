<script lang="ts">
    import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
    import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
    import { faker } from '@faker-js/faker';

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

	interface Part {
		id: number;
		name: string;
		image: string;
	}

	interface Model {
		name: string;
		parts: Part[];
	}

	let parts = [
		{ id: 1, name: faker.commerce.productName(), image: faker.image.urlPicsumPhotos({ width: 64, height: 64 }) },
		{ id: 2, name: faker.commerce.productName(), image: faker.image.urlPicsumPhotos({ width: 64, height: 64 }) },
		{ id: 3, name: faker.commerce.productName(), image: faker.image.urlPicsumPhotos({ width: 64, height: 64 }) },
		{ id: 4, name: faker.commerce.productName(), image: faker.image.urlPicsumPhotos({ width: 64, height: 64 }) }
	];

	let selectedParts: Part[] = [];

	let models: Model[] = [
		{
			name: "Model A",
			parts: [parts[0], parts[1], parts[2]],
		},
		{
			name: "Model B",
			parts: [parts[3], parts[0]],
		}
	]

	let newModelName = '';
	let selectedModel: any = null;


	let newPartName = '';
	let newPartImage: any = null;
	let fileName = "";
	
	function addPart() {
		if (newPartName && newPartImage) {
			parts = [
				...parts, 
				{ id: parts.length+1, name: newPartName, image: newPartImage }];
		}
		console.log('New part added:', newPartName);
		console.log(parts)
		newPartName = '';
		newPartImage = '';
	}
	
	function removePart(partIndex: number) {
		parts = parts.filter((_, i) => i !== partIndex);
		console.log('Removed part with index: ', partIndex);
	}
	
	function editPart(partName: string) {
		// TODO: Implement editing parts
	}
	
	function handleImageUpload(event: any) {
		const file = event.target.files[0];
		if (file) {
			fileName = file.name; 
			const reader = new FileReader();
			reader.onload = (e) => {
				newPartImage = e.target?.result;
			};
			reader.readAsDataURL(file);
		}
	}

	function addModel() {
		if (newModelName) {
			models = [...models, { 
				name: newModelName, 
				parts: selectedParts
			}];
			newModelName = "";
			selectedParts = [];
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
    	const index = selectedParts.findIndex(p => p.id === part.id);
		if (index === -1) {
			selectedParts = [...selectedParts, part];
		} else {
			selectedParts = selectedParts.filter(p => p.id !== part.id);
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
            <Card.Title>Vision System Spare Parts</Card.Title>
        </Card.Header>
        <Card.Content>
            <div class="mb-6">
                <Label for="new-organization">Add New Spare Part</Label>
                <div class="flex gap-2">
                    <Input placeholder="Enter spare part name" bind:value={newPartName} />
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
                            on:change={handleImageUpload}
                            class="hidden"
                        />
                        {#if fileName}
                            <p class="text-gray-600 mt-2 text-sm truncate">{fileName}</p>
                        {/if}
                    </div>
                    <Button type="submit" on:click={addPart}>Add Part</Button>
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
                    {#each parts as part, partIndex}
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

    <Card.Root class="col-span-1 md:col-span-2">
        <Card.Header>
            <Card.Title>Model Management</Card.Title>
        </Card.Header>
        <Card.Content>
            <div class="mb-6">
                <Label for="new-model">Add New Model</Label>
                <div class="space-y-4">
                    <div class="flex gap-2">
                        <Input placeholder="Enter model name" bind:value={newModelName} />
                    </div>

                    <div class="border rounded-md p-4">
                        <Label class="mb-2 block">Select Spare Parts</Label>
                        <div class="grid grid-cols-1 gap-4 mb-4">
                            {#each parts as part}
                                <Button
                                    variant="outline"
                                    class={`flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-gray-50
                                        ${selectedParts.some(p => p.id === part.id) ? 'bg-blue-50' : ''}
                                    `}
                                    
                                    on:click={() => togglePartSelection(part)}	
                                >
                                    <img
                                        src={part.image}
                                        alt={part.name}
                                        class="w-6 h-6 rounded-md object-cover"
                                    />
                                    <span>{part.name}</span>
                                </Button>
                            {/each}
                        </div>
                        <div class="flex justify-between items-center">
                            <p class="text-sm text-gray-500">
                                Selected parts: {selectedParts.length}
                            </p>
                            <Button type="submit" on:click={addModel}>
                                Create Model
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Table.Root>
                <Table.Caption>List of Models</Table.Caption>
                <Table.Header>
                    <Table.Row>
                        <Table.Head class="w-[300px]">Name</Table.Head>
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
                            <Table.Row>
                                <Table.Cell>
                                    <!-- Parts List -->
                                        <Table.Head>
                                            <Table.Row>
                                                <Table.Cell>Associated Parts</Table.Cell>
                                            </Table.Row>
                                        </Table.Head>
                                        <Table.Body>
                                            {#each model.parts as part, partIndex}
                                                <Table.Row>
                                                <Table.Cell>
                                                    <img
                                                        src={part.image}
                                                        alt={part.name}
                                                        class="w-12 h-12 rounded-md object-cover"
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>{part.name}</Table.Cell>
                                                <Table.Cell class="text-right w-[80px]">
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
                                        </Table.Body>
                                </Table.Cell>
                            </Table.Row>
                        {/if}
                    {/each}
                </Table.Body>
            </Table.Root>
        </Card.Content>
    </Card.Root>
</div>