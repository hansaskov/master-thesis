<script lang="ts">
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';

	import { Check } from 'svelte-radix';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';

	const organizations = [
		{ value: 'sys1', label: 'VisioPointer® 1' },
		{ value: 'sys2', label: 'VisioCompact® 1' },
		{ value: 'sys3', label: '360 Inspector® 1' },
		{ value: 'sys4', label: 'SmartInspector® 1' }
	];

	let openCombobox = $state(false);
	let selectedOrg = $state('');

	let selectedOrgLabel = $derived(
		organizations.find((org) => org.value === selectedOrg)?.label ?? `${organizations[0].label}`
	);

	function closeAndFocusTrigger(triggerId: string) {
		openCombobox = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Popover.Root bind:open={openCombobox}>
	<Popover.Trigger>
		<Button
			variant="outline"
			role="combobox"
			aria-expanded={openCombobox}
			class="w-full md:w-[170px] justify-between"
		>
			{selectedOrgLabel}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[170px] p-0">
		<Command.Root>
			<!-- <Command.Input placeholder="Search organization..." /> -->
			<Command.Empty>No organization found.</Command.Empty>
			<a href="/systems">
				<Command.Group>
					{#each organizations as org}
						<Command.Item value={org.value}>
							<Check class={cn('mr-2 h-4 w-4', selectedOrg !== org.value && 'text-transparent')} />
							{org.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</a>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
