<script lang="ts">
	import { dialogStore } from '$lib/stores/dialog.svelte';
	import type { Types } from 'backend';
	import { Button } from './ui/button';
	import { Input } from './ui/input';
	import { Label } from './ui/label';
	import { userStore } from '$lib/stores/user.svelte';

	let props: Types.User = $props();

	let name = $state(props.name);

	function onsubmit(e: SubmitEvent) {
		e.preventDefault();

		userStore.editName({
			id: props.id,
			name: name
		});

		dialogStore.close();
	}
</script>

<form class="grid items-start gap-4" {onsubmit}>
	<div class="grid gap-2">
		<Label for="name">Name</Label>
		<Input id="name" bind:value={name} />
	</div>
	<div class="flex flex-col-reverse md:flex-row gap-2 md:justify-end">
		<Button variant="outline" onclick={() => dialogStore.close()}>Cancel</Button>
		<Button type="submit">Save changes</Button>
	</div>
</form>
