<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import OrgCombobox from './OrgCombobox.svelte';
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Page>
			<OrgCombobox></OrgCombobox>
		</Breadcrumb.Page>
	</Breadcrumb.List>
</Breadcrumb.Root>
