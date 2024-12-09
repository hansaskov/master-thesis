<script lang="ts">
	import DialogAlertBody from "$lib/components/DialogBodies/DialogAlertBody.svelte";
	import ResponsiveDialog from "$lib/components/ResponsiveDialog.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { dialogStore } from "$lib/stores/dialog.svelte";
	import type { Builder } from "bits-ui";



</script>

<Button onclick={() => {
    dialogStore.open({
        title: "Are you absolutely sure?",
        description: "This action cannot be undone. This will permanently delete the organization and all of it's systems",
        children: DialogAlertBody
    })
}}>
Click me!</Button>

<ResponsiveDialog >
</ResponsiveDialog>