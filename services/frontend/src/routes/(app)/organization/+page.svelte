<script lang="ts">
	import { goto } from '$app/navigation';
	import { organizationStore } from '$lib/stores/organization.svelte';

	$effect.pre(() => {
		organizationStore.refreshAll();

		if (organizationStore.organizations.length > 0) {
			goto(`/organization/${organizationStore.organizations[0].id}/systems`);
		}
	});
</script>

You don't have access to any organizations. Please contact your administrator to gain access.
