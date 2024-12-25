type StatusType = 'Active' |'Offline' | 'Paused'

type HealthType = 'Healthy'| 'At Risk'|'Critical'

interface SystemsType {
	id: string;
	name: string;
	health: HealthType;
	status: StatusType;
	type: string;
	image: string;
	lastCheck: string;
}

export const systems: SystemsType[] = [
	{
		id: 'vp1',
		name: 'Production Line 1',
		health: 'Healthy',
		status: 'Active',
		type: 'Production Line 1',
		image: '/placeholder.svg',
		lastCheck: '2 minutes ago'
	},
	{
		id: 'vc1',
		name: 'Assembly Area A',
		health: 'At Risk',
		status: 'Active',
		type: 'VisioCompact® 1',
		image: '/placeholder.svg',
		lastCheck: '5 minutes ago'
	},
	{
		id: '360i1',
		name: 'Quality Control Station',
		health: 'Healthy',
		status: 'Active',
		type: '360 Inspector® 1',
		image: '/placeholder.svg',
		lastCheck: '1 minute ago'
	},
	{
		id: 'si1',
		name: 'Packaging Line 2',
		health: 'Critical',
		status: 'Paused',
		type: 'SmartInspector® 1',
		image: '/placeholder.svg',
		lastCheck: '10 minutes ago'
	},
	{
		id: 'vp2',
		name: 'Production Line 2',
		health: 'Healthy',
		status: 'Paused',
		type: 'VisioPointer® 2',
		image: '/placeholder.svg',
		lastCheck: '15 minutes ago'
	},
	{
		id: 'vc2',
		name: 'Assembly Area B',
		health: 'Healthy',
		status: 'Active',
		type: 'VisioCompact® 2',
		image: '/placeholder.svg',
		lastCheck: '8 minutes ago'
	},
	{
		id: 'vp3',
		name: 'Production Line 2',
		health: 'Healthy',
		status: 'Paused',
		type: 'VisioPointer® 3',
		image: '/placeholder.svg',
		lastCheck: '15 minutes ago'
	},
	{
		id: 'vp4',
		name: 'Assembly Area B',
		health: 'Healthy',
		status: 'Offline',
		type: 'VisioPointer® 4',
		image: '/placeholder.svg',
		lastCheck: '5 hours ago'
	}
];
