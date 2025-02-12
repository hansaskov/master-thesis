<script lang="ts">
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';

	import { Check } from 'svelte-radix';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { page } from '$app/state';
	import { organizationStore } from '$lib/stores/organization.svelte';
	import { systemStore } from '$lib/stores/systems.svelte'
	import { api } from '@/api';
	import { Previous } from 'runed';

	let openCombobox = $state(false);
	let selectedOrg = $state('');

	const previousOrganizationId = new Previous(() => page.params.organizationId);

	// Update organizationId cookie
	$effect(() => {
		if (
			page.params.organizationId &&
			page.params.organizationId != previousOrganizationId.current
		) {
			api.organizations.cookie.post({
				organizationId: page.params.organizationId
			})
			.then(() => {
				systemStore.refresh();
			console.log("system store refreshed");
			});
		}
	});
</script>

{#if page.params.organizationId}
	<Popover.Root bind:open={openCombobox}>
		<Popover.Trigger>
			<Button
				variant="ghost"
				role="combobox"
				aria-expanded={openCombobox}
				class="pr-0 pl-2 font-bold sans-serif tracking-wide text-xl sm:font-medium sm:text-sm"
			>
				{#if organizationStore.currentOrganization}
					{organizationStore.currentOrganization.name}
					<ChevronsUpDown class="h-4 shrink-0 opacity-50" />
				{/if}
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-[170px] p-0">
			<Command.Root bind:value={selectedOrg}>
				<Command.Empty>No organization found.</Command.Empty>

				<Command.Group>
					{#each organizationStore.organizations as org}
						<a href={`/organization/${org.id}/systems`}>
							<Command.Item value={org.id}>
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
