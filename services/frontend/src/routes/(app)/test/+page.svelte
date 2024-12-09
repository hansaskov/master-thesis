<script lang="ts">
	import AlertDialogBody from "$lib/components/AlertDialogBody.svelte";
	import { Button } from "$lib/components/ui/button";
	import { dialogStore } from "$lib/stores/dialog.svelte";
</script>

<Button onclick={() => {
    dialogStore.open({
        title: "Are you absolutely sure?",
        description: "This action cannot be undone. This will permanently delete the organization and all of it's systems",
		component:  AlertDialogBody,
		props: {onsubmit: () => console.log("IT WORKS!")}
    })
}}>
Click me!</Button>

