<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { Types } from 'backend';
	import { partsStore } from '$lib/stores/parts.svelte';
	import { Ellipsis, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { dialogStore } from '$lib/stores/dialog.svelte';
	import AlertDialogBody from '$lib/components/AlertDialogBody.svelte';
	import EditPartDialogBody from '$lib/components/EditPartDialogBody.svelte';
	import { api } from '$lib/api';
	import { onError } from '@/error';
	import * as Avatar from '$lib/components/ui/avatar';

	// parts pagination
	let pageSize = 10;
	let currentPage = $state(0);
	let startIndex = $derived(currentPage * pageSize);
	let endIndex = $derived((currentPage + 1) * pageSize);
	let visibleParts = $derived(partsStore.parts.current.slice(startIndex, endIndex));
	let totalItems = $derived(partsStore.parts.current.length);
	let totalPages = $derived(Math.ceil(totalItems / pageSize));

	function prevPage() {
		if (currentPage > 0) {
			currentPage--;
		}
	}

	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
		}
	}

	let newPart = $state<Types.PartNew>({
		name: '',
		image: ''
	});

	function generateRandomString(length: number) {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		return result;
	}

	async function add() {
		const images = document.getElementById('file-upload') as HTMLInputElement;
		if (images) {
			let image = images.files![0];
			// Get the name as the file
			const originalFileName = image.name.split('\\').pop();
			const extension = originalFileName?.split('.').pop();

			// Generate unique name for database entry
			const uniqueFileName = generateRandomString(12) + '.' + extension;

			newPart.image = uniqueFileName;

			const { error } = await api.files.index.post({ image: image, title: uniqueFileName });

			if (error) {
				onError(error);
			}
		}

		partsStore.add(newPart);
		newPart = {
			name: '',
			image: ''
		};
	}

	let fileName = $state('');

	$effect(() => {
		newPart.image = fileName;
	});
</script>

<Card.Root class="col-span-1 md:col-span-2">
	<Card.Header>
		<Card.Title>Vision System Spare Parts</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="mb-6">
			<Label for="new-part">Add New Spare Part</Label>
			<form
				class="flex gap-2"
				onsubmit={(e) => {
					e.preventDefault();
					add();
				}}
			>
				<Input placeholder="Enter spare part name" bind:value={newPart.name} />
				<Button type="submit">Add Part</Button>
			</form>
		</div>
		<Label for="new-image">Upload image</Label>
		<Input id="file-upload" type="file" accept=".jpg, .jpeg, .png, .webp" bind:value={fileName} />
		<Table.Root class="table-fixed">
			<Table.Caption>
				<Button variant="outline" onclick={() => prevPage()} disabled={currentPage === 0}>
					<ChevronLeft class="w-2 h-2" />
				</Button>
				Showing {visibleParts.length ? startIndex + 1 : 0}–{visibleParts.length ? startIndex + visibleParts.length : 0}
				of {totalItems} results
				<Button
					variant="outline"
					onclick={() => nextPage()}
					disabled={currentPage + 1 === totalPages}
				>
					<ChevronRight class="w-2 h-2" />
				</Button>
			</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-20">Image</Table.Head>
					<Table.Head>Name</Table.Head>
					<Table.Head class="text-right">Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each visibleParts as part}
					<Table.Row>
						<Table.Cell>
							<Avatar.Root>
								<Avatar.Image src={part.image} alt="part-image" />
								<Avatar.Fallback>{part.name}</Avatar.Fallback>
							</Avatar.Root>
						</Table.Cell>
						<Table.Cell>{part.name}</Table.Cell>
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
												title: `Update ${part.name}`,
												description: 'This action will update the name of the selected part',
												component: EditPartDialogBody,
												props: part
											});
										}}
									>
										Edit Part
									</DropdownMenu.Item>
									<DropdownMenu.Separator />
									<DropdownMenu.Item
										onclick={() => {
											dialogStore.open({
												title: 'Are you absolutely sure?',
												description: 'This action cannot be undone',
												component: AlertDialogBody,
												props: { onsubmit: () => partsStore.remove(part) }
											});
										}}
										class="text-red-600"
									>
										Remove Part
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
