<script lang="ts">
    import { page } from '$app/stores';
    import { ArrowLeft } from 'lucide-svelte';
    import { Button } from '$lib/components/ui/button';
    import * as Card from '$lib/components/ui/card';

    // Get the system ID from the route parameters
    $: systemId = $page.params.id;

    const navigationButtons = [
        { label: 'Monitor', href: `monitoring` },
        { label: 'Service', href: `service` },
        { label: 'PI', href: `pi` },
        { label: 'Parts', href: `parts` },
    ];
</script>

<div class="container mx-auto p-4">
    <Button variant="ghost" href="/systems" class="mb-4">
        <ArrowLeft class="mr-2 h-4 w-4" />
        Back to Systems
    </Button>

    <Card.Root>
        <Card.Header>
            <Card.Title>System Details: {systemId}</Card.Title>
            <Card.Description>
                Select an option to view or manage different aspects of this system.
            </Card.Description>
        </Card.Header>
        <Card.Content>
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {#each navigationButtons as button}
                    <Button variant="outline" href="{systemId}/{button.href}" class="w-full">
                        {button.label}
                    </Button>
                {/each}
            </div>
        </Card.Content>
    </Card.Root>
</div>