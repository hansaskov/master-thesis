<script lang="ts">
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';

	import { Check } from 'svelte-radix';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { organizationStore } from '$lib/stores/organization.svelte';

	let openCombobox = $state(false);
	let selectedOrg = $state('');
</script>

<Popover.Root bind:open={openCombobox}>
	<Popover.Trigger>
		<Button
			variant="outline"
			role="combobox"
			aria-expanded={openCombobox}
			class="pr-0 pl-2 font-bold sans-serif tracking-wide text-xl sm:font-medium sm:text-sm"
		>
			{#if organizationStore.currentOrganization}
				{organizationStore.currentOrganization.name}
				<ChevronsUpDown class="h-4 shrink-0 opacity-50" />
			{:else}
				<span>Select Organization</span>
				<ChevronsUpDown class="h-4 shrink-0 opacity-50" />
			{/if}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[170px] p-0">
		<Command.Root bind:value={selectedOrg}>
			<Command.Input placeholder="Search organizations..." />
			<Command.Empty>No organization found.</Command.Empty>

			<Command.Group>
				{#each organizationStore.organizations as org}
					<a href={`/organization/${org.id}/systems`}>
						<Command.Item value={org.name}>
							<Check class={cn('mr-2 h-4 w-4', selectedOrg !== org.id && 'text-transparent')} />
							{org.name}
						</Command.Item>
					</a>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
