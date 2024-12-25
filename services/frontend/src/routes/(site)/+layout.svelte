<script lang="ts">
	import Package2 from 'lucide-svelte/icons/package-2';
	import Moon from 'lucide-svelte/icons/moon';
	import Sun from 'lucide-svelte/icons/sun';
	import { Button } from '$lib/components/ui/button';
	import { toggleMode } from 'mode-watcher';

	let { children } = $props();
</script>

<div class="flex h-screen w-full flex-col bg-background/40 text-foreground">
	<header class="flex h-14 items-center justify-between border-b bg-background px-4 sm:px-6">
		<div class="flex items-center">
			<a href="/" class="flex items-center gap-2 text-lg font-semibold">
				<Package2 class="h-6 w-6" />
				<span>TriVision</span>
			</a>
		</div>
		<nav class="flex items-center gap-2">
			<Button onclick={toggleMode} variant="outline" size="icon" class="h-9 w-9">
				<Sun class="absolute h-4 w-4 rotate-0 scale-100 dark:scale-0" />
				<Moon class="absolute h-4 w-4 rotate-90 scale-0 dark:scale-100 " />
			</Button>
			<Button href="/" variant="outline">Login</Button>
		</nav>
	</header>

	<main class="flex-1 bg-background">
		{@render children()}
	</main>

	<footer class="border-t bg-background p-4 text-center text-sm text-muted-foreground">
		© 2024 TriVision. All rights reserved.
	</footer>
</div>
