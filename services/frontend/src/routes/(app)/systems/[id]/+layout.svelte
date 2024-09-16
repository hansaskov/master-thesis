<script lang="ts">
    import { ArrowLeft } from 'lucide-svelte';
    import { page } from '$app/stores';
    import { Button } from '$lib/components/ui/button';

    $: lowerPathname = $page.url.pathname.split('/').filter(Boolean);
    $: backUrl = '/' + lowerPathname.slice(0, -1).join('/');
    $: previousSection = lowerPathname.at(-2) || '';
</script>

<div class="container mx-auto p-4">
    {#if lowerPathname.length > 1}
            <a href={backUrl} class="inline-block mb-4">
                    <Button variant="ghost">
                            <ArrowLeft class="mr-2 h-4 w-4" />
                            Back to
                            <span class="ml-1 capitalize">{previousSection}</span>
                    </Button>
            </a>
    {/if}
    <slot />
</div>