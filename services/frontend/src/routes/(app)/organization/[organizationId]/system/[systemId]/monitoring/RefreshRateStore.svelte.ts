class RefreshRateStore {
	readonly rates = [
		{ value: (5).toString(), label: '5 seconds' },
		{ value: (30).toString(), label: '30 seconds' },
		{ value: (60 * 5).toString(), label: '5 minutes' },
		{ value: (60 * 60).toString(), label: '1 hour' }
	] as const;
	value = $state(this.rates[0].value);
	label = $derived(
		this.rates.find((f) => f.value === this.value)?.label ?? 'Please select a value'
	);
	inerval = $derived.by(() => {
		const seconds = parseInt(this.value, 10);
		return isNaN(seconds) ? null : seconds * 1000;
	});
}

export const refreshRateStore = new RefreshRateStore();
