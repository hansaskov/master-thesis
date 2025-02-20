<script>
	import KeysForm from './KeysForm.svelte';
	import KeysList from './KeysList.svelte';
</script>

<div class="container mx-auto px-4 py-4">
	<h1 class="mb-6 text-3xl font-bold">Settings</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<KeysList />
		<KeysForm />
	</div>
</div>
