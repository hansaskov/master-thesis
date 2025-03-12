<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import { systemModelStore } from '$lib/stores/system-models.svelte';
	import { partsStore } from '$lib/stores/parts.svelte';

	import VisionModelAccordian from './VisionModelAccordian.svelte';

	systemModelStore.refresh();
</script>

<Card.Root class="col-span-1 md:col-span-2">
	<Card.Header>
		<Card.Title>Default Vision Models</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="mb-6">
			<div class="space-y-4">
				<Accordion.Root type="single">
					<Table.Root>
						{#each systemModelStore.systemModels as model}
							<VisionModelAccordian {model} allParts={partsStore.parts} />
						{/each}
					</Table.Root>
				</Accordion.Root>
			</div>
		</div>
	</Card.Content>
</Card.Root>
