<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { innerWidth } from 'svelte/reactivity/window';
	import ResponsiveDialog from '$lib/components/ResponsiveDialog.svelte';
	let isDesktop = $derived(innerWidth.current! > 768);

	let { children } = $props();
</script>

<ModeWatcher defaultTheme="light" />
<Toaster position={isDesktop ? "bottom-right" : "top-center"}/>
<ResponsiveDialog />

{@render children()}
