<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

	import { goto } from '$app/navigation';
	import { organizationStore } from '$lib/stores/organization.svelte';

	organizationStore.refresh();

	$effect.pre(() => {
		if (organizationStore.currentOrganization) {
			goto(`/organization/${organizationStore.currentOrganization.id}/systems`);
		} else if (organizationStore.organizations.length > 0) {
			goto(`/organization/${organizationStore.organizations[0].id}/systems`);
		}
	});
</script>

<Card.Root class="w-full max-w-md mx-auto">
	<Card.Header>
		<Card.Title class="text-xl">Organization Missing</Card.Title>
		<Card.Description>You are not currently part of any organization.</Card.Description>
	</Card.Header>
	<Card.Content class="text-sm text-muted-foreground">
		Please contact an administrator to be added to an organization.
	</Card.Content>
	<Card.Footer>
		<Button class="w-full">Contact Administrator</Button>
	</Card.Footer>
</Card.Root>
