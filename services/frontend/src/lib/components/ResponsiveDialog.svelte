<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { innerWidth } from 'svelte/reactivity/window';
	import { dialogStore } from '$lib/stores/dialog.svelte';

	let isDesktop = $derived(innerWidth.current! > 768);
</script>

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
			<Drawer.Trigger />
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
