<script lang="ts">
	import type { Checkbox as CheckboxPrimitive, WithoutChildrenOrChild } from 'bits-ui';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';

	let { checked, ...restProps }: WithoutChildrenOrChild<CheckboxPrimitive.RootProps> = $props();
</script>

<Checkbox {checked} {...restProps} />
