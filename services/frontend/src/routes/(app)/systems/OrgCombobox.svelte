<script lang="ts">
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';

	import { Check } from 'svelte-radix';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';

	const organizations = [
		{ value: 'org1', label: 'TriVision' },
		{ value: 'org2', label: 'Organization 2' },
		{ value: 'org3', label: 'Organization 3' },
		{ value: 'org4', label: 'Organization 4' }
	];

	let openCombobox = false;
	let selectedOrg = '';

	$: selectedOrgLabel =
		organizations.find((org) => org.value === selectedOrg)?.label ?? `${organizations[0].label}`;

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
			variant="ghost"
			role="combobox"
			aria-expanded={openCombobox}
			class="md:w-[90px]"
		>
			{selectedOrgLabel}
			<ChevronsUpDown class="h-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[170px] p-0">
		<Command.Root>
			<!-- <Command.Input placeholder="Search organization..." /> -->
			<Command.Empty>No organization found.</Command.Empty>
			<a href="/systems">
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
			</a>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
