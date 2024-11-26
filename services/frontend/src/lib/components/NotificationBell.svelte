<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Bell from 'lucide-svelte/icons/bell';
</script>

<Button variant="outline" size="icon" class="ml-auto h-9 w-9 bg-background">
	<Bell class="h-4 w-4" />
	<span class="sr-only">Toggle notifications</span>
</Button>
