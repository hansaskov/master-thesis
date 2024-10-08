<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import Settings from 'lucide-svelte/icons/settings';

	import { page } from '$app/stores'

    

    let pathname = $page.url.pathname
    $: lastPathname = $page.url.pathname.split('/').filter(Boolean).at(-1)
    $: systemId = $page.params.id;

    let whitelist = ["systems"]

</script>

{#if lastPathname && ( whitelist.includes(lastPathname) || lastPathname === systemId)}
    <Button href={`${pathname}/settings`} variant="outline" size="icon" class="ml-auto h-9 w-9 bg-background">
        <Settings class="h-4 w-4" />
        <span class="sr-only">Settings</span>
    </Button>
{/if}
