import { DateFormatter, getLocalTimeZone, now, type DateValue } from '@internationalized/date';
import type { DateRange } from 'bits-ui';

const df = new DateFormatter('en-US', { dateStyle: 'medium' });

class TimeRangeStore {
	selectorChoises = [
		{ value: 0, label: 'Custom' },
		{ value: 60 * 1, label: 'Last 1 minute' },
		{ value: 60 * 10, label: 'Last 10 minutes' },
		{ value: 60 * 60, label: 'Last hour' },
		{ value: 60 * 60 * 8, label: 'Last 8 hours' },
		{ value: 60 * 60 * 24, label: 'Last 24 hours' },
		{ value: 60 * 60 * 24 * 2, label: 'Last 2 days' },
		{ value: 60 * 60 * 24 * 7, label: 'Last 7 days' },
		{ value: 60 * 60 * 24 * 30, label: 'Last 30 days' }
	] as const;

	value = $state<string>(this.selectorChoises[2].value.toString());
	startValue: DateValue | undefined = $state(undefined);

	label = $derived(
		this.selectorChoises.find((v) => v.value === Number.parseInt(this.value))?.label ??
			'Choose A Time Frame'
	);

	range: DateRange = $state({
		start: now(getLocalTimeZone()).subtract({ minutes: 10 }),
		end: now(getLocalTimeZone())
	});

	rangeString = $derived.by(() => {
		const range = this.range;
		const startValue = this.startValue;

		const start = range.start ? df.format(range.start.toDate(getLocalTimeZone())) : '';
		const end = range.end ? df.format(range.end.toDate(getLocalTimeZone())) : '';

		if (range && range.start && range.end) return `${start} - ${end}`;

		if (range && range.start) return `${start}`;

		if (startValue) return df.format(startValue.toDate(getLocalTimeZone()));

		return 'Pick a date';
	});

	setEndToNow = () => (this.range.end = now(getLocalTimeZone()));
}

export const timeRangeStore = new TimeRangeStore();
