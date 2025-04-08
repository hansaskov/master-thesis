<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { Switch } from '$lib/components/ui/switch';
	import { Button } from '@/components/ui/button';
	import { thresholdStore } from './threshold.svelte';
	import type { ThresholdNew } from '$collections/types';

	thresholdStore.fetchAll();

	async function add(value: ThresholdNew) {
		await thresholdStore.updateThreshold([value]);
		await thresholdStore.fetchAll();
	}

	async function update() {
		const values = thresholdStore.thresholds;

		await thresholdStore.updateThreshold(values);
		await thresholdStore.fetchAll();
	}
</script>

<Card.Root class="md:col-span-2">
	<Card.Header>
		<Card.Title>Configure Thresholds</Card.Title>
		<Card.Description
			>Set your desired thresholds to determine when the system is healthy</Card.Description
		>
	</Card.Header>
	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head>Category</Table.Head>
					<Table.Head>Threshold</Table.Head>
					<Table.Head>Unit</Table.Head>
					<Table.Head>Status</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each thresholdStore.thresholds as threshold}
					<Table.Row
						class={!threshold.enabled ? '*:opacity-75 last-of-type:opacity-100 bg-muted/50' : ''}
					>
						<Table.Cell>{threshold.name}</Table.Cell>
						<Table.Cell>{threshold.category}</Table.Cell>
						<Table.Cell>
							<Input
								type="number"
								bind:value={threshold.threshold}
								disabled={!threshold.enabled}
								class="max-w-[300px]"
							/>
						</Table.Cell>
						<Table.Cell>{threshold.unit}</Table.Cell>
						<Table.Cell>
							<Switch bind:checked={threshold.enabled} />
						</Table.Cell>
					</Table.Row>
				{/each}

				{#each thresholdStore.available as threshold}
					<Table.Row class="*:opacity-75 last-of-type:opacity-100 bg-muted/50">
						<Table.Cell>{threshold.name}</Table.Cell>
						<Table.Cell>{threshold.category}</Table.Cell>
						<Table.Cell>
							<Input
								type="number"
								value=""
								disabled={true}
								class="max-w-[300px] bg-muted"
								placeholder="Not set"
							/>
						</Table.Cell>
						<Table.Cell>{threshold.unit}</Table.Cell>
						<Table.Cell>
							<Button
								variant="outline"
								size="sm"
								onclick={() => add({ ...threshold, enabled: false, threshold: 0 })}>Add</Button
							>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
	<Card.Footer class="justify-end">
		<Button variant="secondary">Discard</Button>
		<Button onclick={() => update()}>Update</Button>
	</Card.Footer>
</Card.Root>
