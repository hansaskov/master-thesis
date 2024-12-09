<script lang="ts">
	import ResponsiveDialog from "$lib/components/ResponsiveDialog.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import type { Builder } from "bits-ui";



</script>

{#snippet trigger({builder}: {builder: Builder})}
    <Button builders={[builder]}>Open</Button>
{/snippet}

<ResponsiveDialog title="Are you absolutely sure?"  description="This action cannot be undone. This will permanently delete the organization and all of it's systems" trigger={trigger} >
    <form class="grid items-start gap-4">
        <div class="grid gap-2">
        <Button variant="destructive" type="submit">Delete Trivision</Button>
    </form>
</ResponsiveDialog>