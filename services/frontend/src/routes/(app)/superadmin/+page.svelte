<script lang="ts">
	import SpareParts from './SpareParts.svelte';
	import Users from './Users.svelte';
	import Organizations from './Organizations.svelte';
	import VisionSystems from './VisionSystems.svelte';
</script>

<div class="md:container">
	<h1 class="mb-6 text-3xl font-bold">Superadmin Settings</h1>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<Users />
		<Organizations />
		<VisionSystems />
		<SpareParts />
	</div>
</div>
