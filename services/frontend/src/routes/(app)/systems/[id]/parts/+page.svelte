<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import Search from 'lucide-svelte/icons/search';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { faker } from '@faker-js/faker';

	const criticalityTypes = ['Critical', 'Important', 'Non-Critical'] as const;

	interface SparePart {
		partNumber: string;
		partName: string;
		quantityInStock: number;
		price: number;
		criticality: 'Critical' | 'Important'| 'Non-Critical';
		image: string;
		quantity: number;
	}

	function generateSparePart(): SparePart {
		return {
			partNumber: faker.string.alphanumeric({ length: 6, casing: 'upper' }),
			partName: faker.commerce.productName(),
			quantityInStock: faker.number.int({ min: 0, max: 100 }),
			price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
			criticality: faker.helpers.arrayElement(criticalityTypes),
			image: faker.image.urlPicsumPhotos({ width: 64, height: 64 }),
			quantity: 0
		};
	}

	let spareParts: SparePart[] = Array.from({ length: 50 }, generateSparePart);

	let searchTerm = '';

	$: filteredParts = spareParts.filter((part) =>
		part.partName.toLowerCase().includes(searchTerm.toLowerCase())
	);
	
	
	const orders = new Map<string, number>();
    
	function increment(part: SparePart) {
		part.quantity += 1;
		spareParts = [...spareParts];
		orders.set(part.partName, part.quantity);
    }
	
    function decrement(part: SparePart) {
		if (part.quantity > 0) part.quantity -= 1;
		spareParts = [...spareParts];
		orders.set(part.partName, part.quantity);
    }
	
	let mailBody: string = "";
	
	function populateMail() {
		mailBody = "";
		orders.forEach((value, key) => {
			mailBody = mailBody.concat(`%0D%0A${key} with quantity ${value}`);
		})
	}

</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title>Spare Parts Inventory</Card.Title>
		<Card.Description>Manage spare parts for your production system.</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="mb-4 flex items-center space-x-2">
			<Search class="h-4 w-4 opacity-50" />
			<Input type="search" placeholder="Search spare parts..." bind:value={searchTerm} />
		</div>
		<div class="overflow-x-auto">
			<Table.Root class="text-xs">
				<Table.Header>
					<Table.Row>
						<Table.Head class="hidden w-[64px] md:table-cell">Image</Table.Head>
						<Table.Head class="hidden md:table-cell">Part Number</Table.Head>
						<Table.Head class="">Part Name</Table.Head>
						<Table.Head class="text-left">Quantity</Table.Head>
						<Table.Head class="hidden md:table-cell">Price</Table.Head>
						<Table.Head class="hidden md:table-cell ">Criticality</Table.Head>
						<Table.Head class="text-center md:text-left">Add To Cart</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each filteredParts as part (part.partNumber)}
						<Table.Row class="cursor-pointer hover:bg-muted">
							<Table.Cell class="hidden md:table-cell">
								<img
									alt="{part.partName} image"
									class="aspect-square rounded-md object-cover"
									height="64"
									width="64"
									src={part.image}
								/>
							</Table.Cell>
							<Table.Cell class="md:table-cell hidden">{part.partNumber}</Table.Cell>
							<Table.Cell>{part.partName}</Table.Cell>
							<Table.Cell class="text-right md:text-left">{part.quantityInStock}</Table.Cell>
							<Table.Cell class="hidden md:table-cell">${part.price.toFixed(2)}</Table.Cell>
							<Table.Cell class="hidden md:table-cell">
								<Badge variant="outline">
									{part.criticality}
								</Badge>
							</Table.Cell>
							<Table.Cell>
								<div class="flex items-center space-x-2 rounded-lg p-2 max-w-[95px]">
									<!-- Minus Button -->
									<Button variant="outline" size="sm" class="h-6 w-6" on:click={() => decrement(part)}>
										-
									</Button>
									<!-- Quantity Display -->
									<div class="text-center font-medium">
										{part.quantity}
									</div>
									<!-- Plus Button -->
									<Button variant="outline" size="sm" class="h-6 w-6" on:click={() => increment(part)}>
										+
									</Button>
								</div>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	</Card.Content>

	<div class="flex justify-center md:justify-end md:pr-20">
		<a href="mailto:spareparts@trivision.dk?subject=Sparepart%20Order&body=Order%20Spareparts:%20{mailBody}">
			<Button
			variant="default"
			class="text-xl font-bold"
			on:click={() => populateMail()}
			>
			Order Now
			</Button>
		</a>
	</div>

	<main class="p-4 pb-[8px]">
		<slot></slot>
	</main>

	<Card.Footer>
		<div class="text-sm text-muted-foreground">
			Showing <strong>{filteredParts.length}</strong>
			of
			<strong>{spareParts.length}</strong>
			 spare parts
		</div>
	</Card.Footer>
</Card.Root>

