<script lang="ts">
	import { page } from '$app/state';
    import * as Card from '$lib/components/ui/card';
    import * as Table from '$lib/components/ui/table';
	import { api } from '@/api';
	import { onError } from '@/error';


    type ApiDataResponse<T extends (...args: any) => Promise<any>> = NonNullable<Awaited<ReturnType<T>>["data"]>
    type Keys = ApiDataResponse<typeof api.keys.index.get>

    const systemId = $derived(page.params.systemId)
    let keys = $state<Keys>([])

    async function fetchKeys() {
        const {data, error} = await api.keys.index.get({
            query: {
                system_id: systemId
            }
        })

        if (error) {
            return onError(error)
        }

        keys = data

    }

    fetchKeys()
</script>


<Card.Root>
    <Card.Header>
        <Card.Title>API Keys</Card.Title>
        <Card.Description>Create and manage API keys for your production system</Card.Description>
    </Card.Header>
    <Card.Content>
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.Head>Name</Table.Head>
                    <Table.Head>Token</Table.Head>
                    <Table.Head>Created</Table.Head>
                    <Table.Head>actions</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each keys as {name, public_key, created_at} }
                    <Table.Row>
                        <Table.Cell>{name}</Table.Cell>
                        <Table.Cell>{public_key}</Table.Cell>
                        <Table.Cell>{created_at}</Table.Cell>
                        <Table.Cell>...</Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </Card.Content>


</Card.Root>