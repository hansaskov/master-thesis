import { api } from '$lib/api';
import type { Types } from 'backend';
import { PersistedState } from 'runed';

interface SystemModelWithParts extends Types.SystemModel {
    parts: Array<{
        id: string;
        name: string;
        image: string | null;
    }>;
}

export class SystemModelStore {
	#systemModels = new PersistedState<SystemModelWithParts[]>('systemModels', [], {
		storage: 'session',
		syncTabs: false
	});

	async refresh() {
		const { data, error } = await api.system_models.index.get();
	
		if (error) {
		  console.error('API Error:', error);
		  return;
		}
	
		console.log('Raw API response:', data);
		
		try {
		  this.#systemModels.current = data;
		  console.log('Successfully updated store with', data.length, 'models');
		} catch (err) {
		  console.error('Error updating store:', err);
		}
	}

	get systemModels() {
		return this.#systemModels.current;
	}
}

export const systemModelStore = new SystemModelStore();
