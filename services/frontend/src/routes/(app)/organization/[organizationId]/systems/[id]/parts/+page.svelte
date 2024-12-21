<script lang="ts">
	import Search from 'lucide-svelte/icons/search';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { faker } from '@faker-js/faker';

	interface SparePart {
		partNumber: string;
		partName: string;
		image: string;
		quantity: number;
	}

	function generateSparePart(): SparePart {
		return {
			partNumber: faker.string.alphanumeric({ length: 6, casing: 'upper' }),
			partName: faker.commerce.productName(),
			image: faker.image.urlPicsumPhotos({ width: 64, height: 64 }),
			quantity: 0
		};
	}

	let spareParts: SparePart[] = $state(Array.from({ length: 20 }, generateSparePart));

	let searchTerm = $state('');

	let filteredParts = $derived(spareParts.filter((part) =>
		part.partName.toLowerCase().includes(searchTerm.toLowerCase())
	));

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

	let mailBody: string = $state('');

	function populateMail() {
		mailBody = '';
		orders.forEach((value, key) => {
			mailBody = mailBody.concat(`%0D%0A${key} with quantity ${value}`);
		});
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
						<Table.Head class="w-[64px]">Image</Table.Head>
						<Table.Head>Part Name</Table.Head>
						<Table.Head class="text-right px-6">Add To Cart</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each filteredParts as part (part.partNumber)}
						<Table.Row class="hover:bg-muted cursor-pointer">
							<Table.Cell>
								<img
									alt="{part.partName} image"
									class="aspect-square rounded-md object-cover"
									height="64"
									width="64"
									src={part.image}
								/>
							</Table.Cell>
							<Table.Cell>{part.partName}</Table.Cell>
							<Table.Cell class="text-right">
								<div class="flex max-w-[95px] items-center space-x-2 rounded-lg p-2 ml-auto">
									<!-- Minus Button -->
									<Button
										variant="outline"
										size="sm"
										class="h-6 w-6"
										onclick={() => decrement(part)}
									>
										-
									</Button>
									<!-- Quantity Display -->
									<div class="text-center font-medium">
										{part.quantity}
									</div>
									<!-- Plus Button -->
									<Button
										variant="outline"
										size="sm"
										class="h-6 w-6"
										onclick={() => increment(part)}
									>
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

	<div class="flex justify-end px-6 pb-6">
		<Button
			href="mailto:spareparts@trivision.dk?subject=Sparepart%20Order&body=Order%20Spareparts:%20{mailBody}"
			variant="default"
			class="text-lg"
			onclick={() => populateMail()}
		>
			Order Now
		</Button>
	</div>

	<Card.Footer class="justify-end">
		<div class="text-muted-foreground text-sm">
			Showing <strong>{filteredParts.length}</strong>
			of
			<strong>{spareParts.length}</strong>
			spare parts
		</div>
	</Card.Footer>
</Card.Root>
