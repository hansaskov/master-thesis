<script lang="ts">
	import { Package2 } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="flex min-h-screen w-full flex-col bg-background/40 text-foreground">
	<header
		class="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 sm:px-6"
	>
		<div class="flex items-center">
			<a href="/" class="flex items-center gap-2 text-lg font-semibold">
				<Package2 class="h-6 w-6" />
				<span>TriVision</span>
			</a>
		</div>
		<nav>
			<Button href="/" variant="outline">Login</Button>
		</nav>
	</header>

	<main class="flex-1 bg-background p-4 sm:p-6">
		<slot></slot>
	</main>

	<footer class="border-t bg-background p-4 text-center text-sm text-muted-foreground">
		© 2024 TriVision. All rights reserved.
	</footer>
</div>
