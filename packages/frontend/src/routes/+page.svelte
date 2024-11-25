<script lang="ts">
	import type { Treaty } from '@elysiajs/eden';

	import { page } from '$app/stores';
	import { treaty } from '@elysiajs/eden';
	import type { App } from 'backend';

	const api = treaty<App>($page.url.host).api;

	let response: ReturnType<typeof api.hello.get>;
	let name: string;

	function onclick() {
		response = api.hello.get({
			query: { name }
		});
	}
</script>

<input type="text" bind:value={name} />

<button {onclick}> Send Requests </button>

{#await response}
	<p>Loading...</p>
{:then { data, error }}
	{#if error}
		<p>Error response: {error.value}</p>
	{:else}
		<p>Yippy. I got the following result: {data}</p>
	{/if}
{:catch error}
	<p>{error.message}</p>
{/await}
