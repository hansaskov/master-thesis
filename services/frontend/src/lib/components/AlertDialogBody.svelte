<script lang="ts">
	import { dialogStore } from "$lib/stores/dialog.svelte";

	import { Button } from "./ui/button";

    let { onsubmit }: {onsubmit: () => void} = $props()

</script>
<form class="grid items-start gap-4">
    <div class="flex flex-col-reverse md:flex-row  gap-2 md:justify-end">
        <Button variant="outline" onclick={() => dialogStore.close() }>Cancel</Button>
        <Button variant="destructive" type="submit" onclick={() => {onsubmit(); dialogStore.close()}}>Delete</Button>
    </div>
</form>