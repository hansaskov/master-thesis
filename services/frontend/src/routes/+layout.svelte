<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import ResponsiveDialog from '$lib/components/ResponsiveDialog.svelte';

	let { children } = $props();
</script>

<ModeWatcher defaultTheme="light" />
<Toaster />
<ResponsiveDialog />

{@render children()}
