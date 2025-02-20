<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { keysStore } from './keys.svelte';

	function onsubmit(e: SubmitEvent) {
		e.preventDefault();
		keysStore.create();
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Setup New Vision System</Card.Title>
		<Card.Description>Create your newly deployed vision system here</Card.Description>
	</Card.Header>
	<Card.Content>
		<form {onsubmit}>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<Label for="system-name" class="text-sm font-medium">Name</Label>
					<Input placeholder="Enter system name" bind:value={keysStore.newKey.name} />
				</div>

				<div class="md:pt-4 flex justify-end">
					<Button type="submit">Create</Button>
				</div>
			</div>
		</form>
	</Card.Content>
</Card.Root>
