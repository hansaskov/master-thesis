<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Alert from '$lib/components/ui/alert';
	import * as Table from '$lib/components/ui/table';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import Copy from 'lucide-svelte/icons/copy';
	import AlertCircle from 'lucide-svelte/icons/circle-alert';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { api } from '@/api';

	type User = NonNullable<Awaited<ReturnType<typeof api.users.onOrganization.get>>['data']>[number];
	type Invite = NonNullable<
		Awaited<ReturnType<typeof api.invites.onOrganization.get>>['data']
	>[number];

	let users = $state<User[]>([]);
	let invites = $state<Invite[]>([]);
    let newUserEmail = $state('');

	async function getUsers() {
		let { data, error } = await api.users.onOrganization.get();

		if (data) {
			users = data;
		}

		if (error) {
			console.error(error);
		}
	}

	async function removeUser(id: string) {
		let { data, error } = await api.users.index.delete({ id });

		getUsers();
	}

	async function getInvites() {
		let { data, error } = await api.invites.onOrganization.get();

		if (data) {
			invites = data;
		}

		if (error) {
			console.error(error);
		}
	}

	async function inviteUser() {
		let { data, error } = await api.invites.index.post({ email: newUserEmail });

		if (error) {
			console.error(error);
			return;
		}

		console.log('Successfully invited user');
		getInvites();
	}

	async function updateInvite() {}



	function resendOnboardingEmail(email: string) {
		console.log('Resend onboarding email to:', email);
		// TODO: Implement email resend functionality
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text).then(() => {
			console.log('Copied to clipboard');
			// You could add a toast notification here
		});
	}

	getUsers();
	getInvites();
</script>

<Card.Root class="col-span-1 md:col-span-2">
	<Card.Header>
		<Card.Title>User Management</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="mb-6">
			<Label for="new-user">Invite New User</Label>
			<div class="flex gap-2">
				<Input id="new-user" type="email" placeholder="Enter email" bind:value={newUserEmail} />
				<Button onclick={inviteUser}>Invite & Onboard</Button>
			</div>
		</div>

		<Table.Root>
			<Table.Caption>Users and Onboarding Status</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[300px]">User</Table.Head>
					<Table.Head>Role</Table.Head>
					<Table.Head>Onboarding Status</Table.Head>
					<Table.Head class="text-right">Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each users as person}
					<Table.Row>
						<Table.Cell>
							<div class="flex items-center space-x-4">
								<Avatar.Root>
									<Avatar.Image src={person.image ?? ''} alt={person.name} />
									<Avatar.Fallback class="font-semibold uppercase">
										{person.name.slice(0, 2)}
									</Avatar.Fallback>
								</Avatar.Root>
								<div>
									<div class="font-bold">{person.name}</div>
									<div class="text-sm text-muted-foreground">{person.email}</div>
								</div>
							</div>
						</Table.Cell>
						<Table.Cell>{person.role}</Table.Cell>
						<Table.Cell>{true}</Table.Cell>
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
									<DropdownMenu.Separator />
									<DropdownMenu.Item onclick={() => removeUser(person.id)} class="text-red-600">
										Remove User
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
