<script>
	import { Button } from '@/components/ui/button';
	import KeysForm from './KeysForm.svelte';
	import KeysList from './KeysList.svelte';
	import { dialogStore } from '@/stores/dialog.svelte';
</script>

<div class="container mx-auto px-4 py-4">
	<div class="flex flex-row justify-between">
		<h1 class="mb-6 text-3xl font-bold">Settings</h1>
		<Button
			onclick={() => {
				dialogStore.open({
					title: `Create a new Api Key`,
					description: 'This action will create a new api key on your system',
					component: KeysForm,
					props: {}
				});
			}}
		>
			+ Create API Key
		</Button>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<KeysList />
	</div>
</div>
