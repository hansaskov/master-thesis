<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import { Label } from '@/components/ui/label';
	import { refreshRateStore } from './RefreshRateStore.svelte';
	import { timeRangeStore } from '@/stores/TimeRangeStore.svelte';
</script>

<div class="grid w-full md:w-[200px]">
	<Label class="text-sm font-medium mb-1">Refresh Rate</Label>
	<Select.Root
		type="single"
		bind:value={refreshRateStore.value}
		onValueChange={timeRangeStore.setEndToNow}
	>
		<Select.Trigger class="w-[180px]">{refreshRateStore.label}</Select.Trigger>
		<Select.Content>
			{#each refreshRateStore.rates as { value, label }}
				<Select.Item {value} {label}>{label}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</div>
