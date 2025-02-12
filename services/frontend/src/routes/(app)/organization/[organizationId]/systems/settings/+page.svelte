<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { systemStore } from '$lib/stores/systems.svelte';
	import OrganizationSettings from './OrganizationSettings.svelte';

	import type { Types } from 'backend';
	import UserSettings from './UserSettings.svelte';

	let newSystem = $state<Types.SystemNew>();

	let newSystemName = $state('');

	$effect.pre(() => {
		systemStore.selectAll();
	});
</script>

<div class="container mx-auto px-4 py-4">
	<h1 class="mb-6 text-3xl font-bold">Settings</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		
		<UserSettings />
		<OrganizationSettings />

		<Card.Root>
			<Card.Header>
				<Card.Title>Production Systems</Card.Title>
			</Card.Header>
			<Card.Content>
				<form
					onsubmit={(e) => {
						e.preventDefault();
						systemStore.add(newSystem!);
						newSystemName = '';
					}}
					class="mb-4"
				>
					<Label for="system-name">New Vision System</Label>
					<div class="mt-2 flex gap-2">
						<Input id="system-name" placeholder="Enter system name" bind:value={newSystemName} />
						<Button type="submit">Add System</Button>
					</div>
				</form>
				{#if systemStore.systems.length > 0}
					<Table.Root>
						<Table.Caption>Existing Vision Systems</Table.Caption>
						<Table.Header>
							<Table.Row>
								<Table.Head>System Name</Table.Head>
								<Table.Head class="text-right">Actions</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each systemStore.systems as system}
								<Table.Row>
									<Table.Cell>{system.name}</Table.Cell>
									<Table.Cell class="text-right">
										<Button
											variant="destructive"
											size="sm"
											onclick={() => systemStore.delete(system.id)}
										>
											Remove
										</Button>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				{:else}
					<p class="mt-4 text-center text-muted-foreground">No vision systems added yet.</p>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>
</div>
