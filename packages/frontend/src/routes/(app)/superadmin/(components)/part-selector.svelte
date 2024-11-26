<script lang="ts">
	import Check from "svelte-radix/Check.svelte";
	import CaretSort from "svelte-radix/CaretSort.svelte";
	import { tick } from "svelte";

	import { cn } from "$lib/utils.js";
	import { Button } from '$lib/components/ui/button';
	import * as Command from "$lib/components/ui/command";
	import * as Popover from "$lib/components/ui/popover";
	import { partsStore, type Part } from "$lib/stores/parts.svelte";


	let partsData = partsStore;
	let open = false;

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="flex-1 justify-between md:max-w-[200px] lg:max-w-[300px]"
		>
			{partsStore.selectedParts}
			<CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-full p-0 md:w-[200px] lg:w-[300px]">
		<Command.Root>
			<Command.Input placeholder="Search parts..." />
			<Command.List>
				<Command.Empty>No presets found.</Command.Empty>
				<Command.Group heading="Examples">
					{#each partsStore.parts as part}
						<Command.Item
							class="aria-selected:bg-primary aria-selected:text-primary-foreground"
							onSelect={() => {
								closeAndFocusTrigger(ids.trigger);
							}}
						>
							{part.name}
							<Check
								class={cn(
									"ml-auto h-4 w-4",
									part.selected ? "opacity-100" : "opacity-0"
								)}
							/>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>