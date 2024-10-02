<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import Settings from 'lucide-svelte/icons/settings';
</script>

<Button variant="outline" size="icon" class="ml-auto h-9 w-9 bg-background">
	<Settings class="h-4 w-4" />
	<span class="sr-only">Settings</span>
</Button>
    