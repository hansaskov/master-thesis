<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import CalendarIcon from 'svelte-radix/Calendar.svelte';
	import {
		DateFormatter,
		getLocalTimeZone,
		now,
		type DateValue
	} from '@internationalized/date';
	import { Label } from '@/components/ui/label';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import type { DateRange } from 'bits-ui';
	import { cn } from '@/utils';
	import { RangeCalendar } from '@/components/ui/range-calendar';

	let { ...props } = $props();

	const timerangeSelectorChoices = [
		{ value: 0, label: 'Custom' },
		{ value: 60 * 10, label: 'Last 10 minutes' },
		{ value: 60 * 60, label: 'Last hour' },
		{ value: 60 * 60 * 8, label: 'Last 8 hours' },
		{ value: 60 * 60 * 24, label: 'Last 24 hours' }
	] as const;

	const df = new DateFormatter('en-US', { dateStyle: 'medium' });

	let value = $state<string>(`${60 * 10}`);

	let range: DateRange = $state({
		start: now(getLocalTimeZone()),
		end: now(getLocalTimeZone()).subtract({ minutes: 10 })
	});

	const formatRange = $derived.by(() => {
		const start = range.start ? df.format(range.start.toDate(getLocalTimeZone())) : '';
		const end = range.end ? df.format(range.end.toDate(getLocalTimeZone())) : '';

		if (range && range.start && range.end) return `${start} - ${end}`;

		if (range && range.start) return `${start}`;

		if (startValue) return df.format(startValue.toDate(getLocalTimeZone()));

		return 'Pick a date';
	});

	let selectContent = $derived(
		timerangeSelectorChoices.find((v) => v.value === Number.parseInt(value))?.label ??
			'Choose A Time Frame'
	);

	let startValue: DateValue | undefined = $state(undefined);
</script>

<div {...props}>
	<div class="flex flex-col sm:flex-row-reverse sm:justify-start items-end gap-4">
		<!-- Time Range Select -->
		<div class="grid w-full">
			<Label class="text-sm font-medium mb-1">Select Range</Label>
			<Select.Root
				type="single"
				bind:value
				onValueChange={(v) => {
					if (!v || v.length === 0 || v === '0') {
						return;
					}

					range = {
						start: now(getLocalTimeZone()).subtract({ seconds: Number.parseInt(v) }),
						end: now(getLocalTimeZone())
					};
				}}
			>
				<Label class="text-sm font-medium mb-1"></Label>
				<Select.Trigger class="w-full" placeholder="Select time range">
					{selectContent}
				</Select.Trigger>
				<Select.Content>
					{#each timerangeSelectorChoices as { value, label }}
						<Select.Item value={`${value}`} {label} />
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<!-- Date Range Pickers (shown only for custom time range) -->
		{#if value === '0'}
			<div class="grid w-full md:w-auto">
				<Label class="text-sm font-medium mb-1">Custom Range</Label>
				<Popover.Root>
					<Popover.Trigger
						class={cn(buttonVariants({ variant: 'outline' }), !range && 'text-muted-foreground')}
					>
						<CalendarIcon class="mr-2 size-4" />
						{formatRange}
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0" align="start">
						<RangeCalendar
							bind:value={range}
							onStartValueChange={(v) => {
								startValue = v;
							}}
							numberOfMonths={2}
						/>
					</Popover.Content>
				</Popover.Root>
			</div>
		{/if}
	</div>
</div>
