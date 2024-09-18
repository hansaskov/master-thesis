<script lang="ts">
	import { MoreHorizontal, Search } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { faker } from '@faker-js/faker';

	const criticalityTypes = ['Critical', 'Important', 'Non-Critical'] as const;

	function generateSparePart() {
		return {
			partNumber: faker.string.alphanumeric({ length: 6, casing: 'upper' }),
			partName: faker.commerce.productName(),
			quantityInStock: faker.number.int({ min: 0, max: 100 }),
			price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
			criticality: faker.helpers.arrayElement(criticalityTypes),
			image: faker.image.urlPicsumPhotos({ width: 64, height: 64 })
		};
	}

	const spareParts = Array.from({ length: 50 }, generateSparePart);

	let searchTerm = '';

	$: filteredParts = spareParts.filter((part) =>
		part.partName.toLowerCase().includes(searchTerm.toLowerCase())
	);
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
						<Table.Head class="">Part Number</Table.Head>
						<Table.Head class="">Part Name</Table.Head>
						<Table.Head class="">Quantity</Table.Head>
						<Table.Head class="hidden md:table-cell">Price</Table.Head>
						<Table.Head class="hidden md:table-cell ">Criticality</Table.Head>
						<Table.Head class="">Actions</Table.Head>
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
							<Table.Cell class="font-medium">{part.partNumber}</Table.Cell>
							<Table.Cell>{part.partName}</Table.Cell>
							<Table.Cell class="text-right md:text-left">{part.quantityInStock}</Table.Cell>
							<Table.Cell class="hidden md:table-cell">${part.price.toFixed(2)}</Table.Cell>
							<Table.Cell class="hidden md:table-cell">
								<Badge variant="outline">
									{part.criticality}
								</Badge>
							</Table.Cell>
							<Table.Cell>
								<div class="flex items-center justify-end">
									<DropdownMenu.Root>
										<DropdownMenu.Trigger asChild let:builder>
											<Button builders={[builder]} size="icon" variant="ghost">
												<MoreHorizontal class="h-4 w-4" />
												<span class="sr-only">Actions</span>
											</Button>
										</DropdownMenu.Trigger>
										<DropdownMenu.Content align="end">
											<DropdownMenu.Label>Actions</DropdownMenu.Label>
											<DropdownMenu.Item>View Details</DropdownMenu.Item>
											<DropdownMenu.Item>Update Stock</DropdownMenu.Item>
											<DropdownMenu.Item>Order More</DropdownMenu.Item>
										</DropdownMenu.Content>
									</DropdownMenu.Root>
								</div>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	</Card.Content>
	<Card.Footer>
		<div class="text-sm text-muted-foreground">
			Showing <strong>{filteredParts.length}</strong>
			of
			<strong>{spareParts.length}</strong>
			 spare parts
		</div>
	</Card.Footer>
</Card.Root>
