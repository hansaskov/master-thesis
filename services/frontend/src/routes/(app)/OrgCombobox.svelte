<script lang="ts">
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';

	import { Check } from 'svelte-radix';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import { page } from '$app/stores';
	import { organizationStore } from '$lib/stores/organization.svelte';

	let currentOrganization = $derived.by(() => {
		return organizationStore.organizations.find((v) => v.id === $page.params.organizationId);
	});

	let openCombobox = $state(false);
	let selectedOrg = $state('');

	function closeAndFocusTrigger(triggerId: string) {
		openCombobox = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

{#if $page.params.organizationId}
	<Popover.Root bind:open={openCombobox} let:ids>
		<Popover.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="ghost"
				role="combobox"
				aria-expanded={openCombobox}
				class="pr-0 pl-2 font-bold sans-serif tracking-wide text-xl sm:font-medium sm:text-sm"
			>
				{#if currentOrganization}
					{currentOrganization.name}
					<ChevronsUpDown class="h-4 shrink-0 opacity-50" />
				{/if}
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-[170px] p-0">
			<Command.Root>
				<Command.Empty>No organization found.</Command.Empty>

				<Command.Group>
					{#each organizationStore.organizations as org}
						<a href={`/organization/${org.id}/systems`}>
							<Command.Item
								value={org.id}
								onSelect={(currentValue) => {
									selectedOrg = currentValue;
									closeAndFocusTrigger(ids.trigger);
								}}
							>
								<Check class={cn('mr-2 h-4 w-4', selectedOrg !== org.id && 'text-transparent')} />
								{org.name}
							</Command.Item>
						</a>
					{/each}
				</Command.Group>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
{/if}
