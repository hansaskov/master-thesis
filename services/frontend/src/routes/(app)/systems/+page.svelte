<script lang="ts">
	import DataTable from './data-table.svelte';
	import * as Card from '$lib/components/ui/card';

	type SystemsType = {
		id: string;
		name: string;
		status: 'Active' | 'Offline' | 'Paused';
		location: string;
		image: string;
		lastCheck: string;
	};

	const data: SystemsType[] = [
		{
			id: 'vp1',
			name: 'VisioPointer® 1',
			status: 'Active',
			location: 'Production Line 1',
			image: '/placeholder.svg',
			lastCheck: '2 minutes ago'
		},
		{
			id: 'vc1',
			name: 'VisioCompact® 1',
			status: 'Active',
			location: 'Assembly Area A',
			image: '/placeholder.svg',
			lastCheck: '5 minutes ago'
		},
		{
			id: '360i1',
			name: '360 Inspector® 1',
			status: 'Active',
			location: 'Quality Control Station',
			image: '/placeholder.svg',
			lastCheck: '1 minute ago'
		},
		{
			id: 'si1',
			name: 'SmartInspector® 1',
			status: 'Paused',
			location: 'Packaging Line 2',
			image: '/placeholder.svg',
			lastCheck: '10 minutes ago'
		},
		{
			id: 'vp2',
			name: 'VisioPointer® 2',
			status: 'Paused',
			location: 'Production Line 2',
			image: '/placeholder.svg',
			lastCheck: '15 minutes ago'
		},
		{
			id: 'vc2',
			name: 'VisioCompact® 2',
			status: 'Active',
			location: 'Assembly Area B',
			image: '/placeholder.svg',
			lastCheck: '8 minutes ago'
		},
		{
			id: 'vp3',
			name: 'VisioPointer® 3',
			status: 'Paused',
			location: 'Production Line 2',
			image: '/placeholder.svg',
			lastCheck: '15 minutes ago'
		},
		{
			id: 'vp4',
			name: 'VisioPointer® 4',
			status: 'Offline',
			location: 'Assembly Area B',
			image: '/placeholder.svg',
			lastCheck: '5 hours ago'
		}
	];
</script>

<div class="container mx-auto px-4 py-4">
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<Card.Root class="col-span-1 md:col-span-2">
			<Card.Header>
				<Card.Title>Production Systems</Card.Title>
			</Card.Header>
			<Card.Content>
				<DataTable {data} />
			</Card.Content>
		</Card.Root>
	</div>
</div>
