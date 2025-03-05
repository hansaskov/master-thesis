<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import CalendarIcon from 'svelte-radix/Calendar.svelte';
	import { getLocalTimeZone, now } from '@internationalized/date';
	import { Label } from '@/components/ui/label';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '@/utils';
	import { RangeCalendar } from '@/components/ui/range-calendar';
	import { timeRangeStore } from './TimeRangeStore.svelte';

	let { ...props } = $props();
</script>

<div {...props}>
	<div class="flex flex-col sm:flex-row-reverse sm:justify-start items-end gap-4">
		<!-- Time Range Select -->
		<div class="grid w-full md:w-[200px]">
			<Label class="text-sm font-medium mb-1">Select Range</Label>
			<Select.Root
				type="single"
				bind:value={timeRangeStore.value}
				onValueChange={(v) => {
					if (!v || v.length === 0 || v === '0') {
						return;
					}

					timeRangeStore.range = {
						start: now(getLocalTimeZone()).subtract({ seconds: Number.parseInt(v) }),
						end: now(getLocalTimeZone())
					};
				}}
			>
				<Label class="text-sm font-medium mb-1"></Label>
				<Select.Trigger class="w-full" placeholder="Select time range">
					{timeRangeStore.label}
				</Select.Trigger>
				<Select.Content>
					{#each timeRangeStore.selectorChoises as { value, label }}
						<Select.Item value={`${value}`} {label} />
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<!-- Date Range Pickers (shown only for custom time range) -->
		{#if timeRangeStore.value === '0'}
			<div class="grid w-full md:w-[250px]">
				<Label class="text-sm font-medium mb-1">Custom Range</Label>
				<Popover.Root>
					<Popover.Trigger
						class={cn(
							buttonVariants({ variant: 'outline' }),
							!timeRangeStore.range && 'text-muted-foreground'
						)}
					>
						<CalendarIcon class="mr-2 size-4" />
						{timeRangeStore.rangeString}
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0" align="start">
						<RangeCalendar
							bind:value={timeRangeStore.range}
							onStartValueChange={(v) => {
								timeRangeStore.startValue = v;
							}}
							numberOfMonths={2}
						/>
					</Popover.Content>
				</Popover.Root>
			</div>
		{/if}
	</div>
</div>
