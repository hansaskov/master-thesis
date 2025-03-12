<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { Eye, EyeOff, ClipboardCopy, Check } from 'lucide-svelte';
	import { keysStore } from './keys.svelte';
	import { dialogStore } from '@/stores/dialog.svelte';

	type Key = Awaited<ReturnType<typeof keysStore.create>>;

	let key = $state<Key>();
	let showPrivateKey = $state(false);
	let copied = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		key = await keysStore.create();
		if (key && dialogStore.data) {
			dialogStore.data.title = 'Success!';
			dialogStore.data.description = 'You can only see this key once. Store it safely.';
		}
	}

	async function handleCopy() {
		if (!key) return;

		await navigator.clipboard.writeText(key.private_key);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	keysStore.fetch()
</script>

<form onsubmit={handleSubmit}>
	<div class="grid w-full items-center gap-4">
		{#if !key}
			<div class="flex flex-col space-y-1.5">
				<Label>Name</Label>
				<Input placeholder="Your API key name" bind:value={keysStore.newKey.name} />
			</div>
		{:else}
			<div class="flex flex-col space-y-1.5">
				<Label>Secret</Label>
				<div class="relative">
					<Input
						type={showPrivateKey ? 'text' : 'password'}
						value={key.private_key}
						readonly
						class="pr-20"
					/>
					<button
						type="button"
						class="absolute right-10 top-1/2 -translate-y-1/2 p-2 hover:text-gray-700"
						onclick={() => (showPrivateKey = !showPrivateKey)}
					>
						{#if showPrivateKey}
							<EyeOff class="h-4 w-4" />
						{:else}
							<Eye class="h-4 w-4" />
						{/if}
					</button>
					<button
						type="button"
						class="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:text-gray-700"
						onclick={handleCopy}
					>
						{#if copied}
							<Check class="h-4 w-4 text-green-600" />
						{:else}
							<ClipboardCopy class="h-4 w-4" />
						{/if}
					</button>
				</div>
			</div>
		{/if}

		<div class="flex flex-col-reverse md:flex-row gap-2 md:justify-end">
			<Button variant="outline" onclick={() => dialogStore.close()}>
				{key ? 'Done' : 'Cancel'}
			</Button>

			{#if !key}
				<Button type="submit">Add</Button>
			{/if}
		</div>
	</div>
</form>
