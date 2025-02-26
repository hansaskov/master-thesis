<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { userStore } from '$lib/stores/user.svelte';
	import * as Avatar from '$lib/components/ui/avatar';

	userStore.loadAllUser();

	let searchTerm = $state('');
	let filteredUsers = $derived(
		userStore.allUsers.current.filter(
			(user) =>
				user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email?.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	let pageSize = 10;
	let currentPage = $state(0);
	let totalItems = $derived(filteredUsers.length);
	let totalPages = $derived(Math.ceil(totalItems / pageSize));

	let startIndex = $derived(currentPage * pageSize);
	let endIndex = $derived((currentPage + 1) * pageSize);
	let visibleUsers = $derived(filteredUsers.slice(startIndex, endIndex));

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

	async function handleRoleChange(id: string, newValue: boolean) {
		await userStore.edit(id, newValue);
	}
</script>

<Card.Root class="col-span-1 md:col-span-2">
	<Card.Header>
		<Card.Title>User Management</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="space-y-2">
			<Label>Search Users</Label>
			<Input
				bind:value={searchTerm}
				placeholder="Search by name or email..."
				class="max-w-[400px]"
			/>
		</div>

		<Table.Root class="table-fixed">
			<Table.Caption>
				<Button variant="outline" onclick={() => prevPage()} disabled={currentPage === 0}>
					<ChevronLeft class="w-2 h-2" />
				</Button>
				Showing {startIndex + 1}–{startIndex + visibleUsers.length}
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
					<Table.Head class="text-left w-20">Image</Table.Head>
					<Table.Head class="text-left w-28">Name</Table.Head>
					<Table.Head class="hidden md:table-cell text-left">Email</Table.Head>
					<Table.Head class="text-right">Role</Table.Head>
				</Table.Row>
			</Table.Header>
			{#each visibleUsers as user}
				<Table.Row>
					<Table.Cell>
						<Avatar.Root>
							<Avatar.Image src={user.image} alt="user-image"/>
							<Avatar.Fallback>{user.name}</Avatar.Fallback>
						</Avatar.Root>
					</Table.Cell>
					<Table.Cell>
						{user.name}
					</Table.Cell>
					<Table.Cell class="hidden md:table-cell">
						{user.email}
					</Table.Cell>
					<Table.Cell class="text-right">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger class="">
								<Button variant="ghost" class="">
									<span>{user.is_superadmin ? 'Superadmin' : 'User'}</span>
									<ChevronDown class="h-4 w-4" />
								</Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end">
								<DropdownMenu.Label>Change Role</DropdownMenu.Label>
								<DropdownMenu.Separator />
								<DropdownMenu.Item onclick={() => handleRoleChange(user.id, true)}>
									Superadmin
								</DropdownMenu.Item>
								<DropdownMenu.Item onclick={() => handleRoleChange(user.id, false)}>
									User
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={3} class="text-center">
						{searchTerm ? `No users found matching "${searchTerm}"` : 'No users found'}
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Root>
	</Card.Content>
</Card.Root>
