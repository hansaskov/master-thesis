<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { innerWidth } from 'svelte/reactivity/window';
	import ResponsiveDialog from '$lib/components/ResponsiveDialog.svelte';
	import { onMount } from 'svelte';

	async function detectSWUpdate() {
		const registration = await navigator.serviceWorker.ready;

		registration.addEventListener('updatefound', () => {
			const newSW = registration.installing;
			newSW?.addEventListener('statechange', () => {
				if (newSW.state === 'installed') {
					if (confirm('New update available! Reload to update')) {
						newSW.postMessage({ type: 'SKIP_WAITING' });
						window.location.reload();
					}
				}
			});
		});
	}

	onMount(() => {
		detectSWUpdate();
	});

	let isDesktop = $derived(innerWidth.current! > 768);

	let { children } = $props();
</script>

<ModeWatcher defaultTheme="light" />
<Toaster position={isDesktop ? 'bottom-right' : 'top-center'} />
<ResponsiveDialog />

{@render children()}
