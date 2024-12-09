<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { dialogStore } from '$lib/stores/dialog.svelte';

	let innerWidth = $state(window.innerWidth);
	let isDesktop = $derived(innerWidth > 768);
</script>

<svelte:window bind:innerWidth />

{#if dialogStore.data}
	{#if isDesktop}
		<Dialog.Root bind:open={dialogStore.isOpen}>
			<Dialog.Trigger />
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>{dialogStore.data.title}</Dialog.Title>
					<Dialog.Description>
						{dialogStore.data.description}
					</Dialog.Description>
				</Dialog.Header>
				<dialogStore.data.component {...dialogStore.data.props} />
			</Dialog.Content>
		</Dialog.Root>
	{:else}
		<Drawer.Root bind:open={dialogStore.isOpen}>
			<Dialog.Trigger />
			<Drawer.Content>
				<Drawer.Header class="text-left">
					<Drawer.Title>{dialogStore.data.title}</Drawer.Title>
					<Drawer.Description>
						{dialogStore.data.description}
					</Drawer.Description>
				</Drawer.Header>
				<div class="px-4 pb-4">
					<dialogStore.data.component {...dialogStore.data.props} />
				</div>
			</Drawer.Content>
		</Drawer.Root>
	{/if}
{/if}
