<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table'; 
    import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
	import type { Types } from 'backend';
	import { partsStore } from '$lib/stores/new-parts.svelte';


    let newPart = $state<Types.PartNew>({
        name: ""
    })

</script>    


<Card.Root class="col-span-1 md:col-span-2">
    <Card.Header>
        <Card.Title>Vision System Spare Parts</Card.Title>
    </Card.Header>
    <Card.Content>
        <div class="mb-6">
            <Label for="new-organization">Add New Spare Part</Label>
            <div class="flex gap-2">
                <Input placeholder="Enter spare part name" bind:value={newPart.name} />
                <Button type="submit" on:click={() => partsStore.add(newPart)}>Add Part</Button>
            </div>
        </div>

        <Table.Root>
            <Table.Caption>List of Spare Parts</Table.Caption>
            <Table.Header >
                <Table.Row>
                    <Table.Head class="w-[300px]">ID</Table.Head>
                    <Table.Head class="text-right">Name</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each partsStore.parts as part}
                    <Table.Row>
                        <Table.Cell>{part.id}</Table.Cell>
                        <Table.Cell class="text-right">{part.name}</Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </Card.Content>
</Card.Root>