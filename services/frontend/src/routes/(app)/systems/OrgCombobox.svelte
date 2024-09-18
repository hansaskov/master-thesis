<script lang="ts">
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';

	import { Check } from 'svelte-radix';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { ChevronsUpDown } from 'lucide-svelte';
	import { tick } from 'svelte';

	const organizations = [
		{ value: 'org1', label: 'Organization 1' },
		{ value: 'org2', label: 'Organization 2' },
		{ value: 'org3', label: 'Organization 3' },
		{ value: 'org4', label: 'Organization 4' }
	];

	let openCombobox = false;
	let selectedOrg = '';

	$: selectedOrgLabel =
		organizations.find((org) => org.value === selectedOrg)?.label ?? 'Select an organization...';

	function closeAndFocusTrigger(triggerId: string) {
		openCombobox = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Popover.Root bind:open={openCombobox} let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={openCombobox}
			class="w-[200px] justify-between"
		>
			{selectedOrgLabel}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.Input placeholder="Search organization..." />
			<Command.Empty>No organization found.</Command.Empty>
			<Command.Group>
				{#each organizations as org}
					<Command.Item
						value={org.value}
						onSelect={(currentValue) => {
							selectedOrg = currentValue;
							closeAndFocusTrigger(ids.trigger);
						}}
					>
						<Check class={cn('mr-2 h-4 w-4', selectedOrg !== org.value && 'text-transparent')} />
						{org.label}
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
