import { api } from '$lib/api';
//import { onError } from '$lib/error';
import type { Types } from 'backend';
import { PersistedState } from 'runed';
//import { toast } from 'svelte-sonner';

export class SystemModelStore {
	#systemModels = new PersistedState<Types.SystemModel[]>('systemModels', [], {
		storage: 'session',
		syncTabs: false
	});

	async refresh() {
		const { data, error } = await api.system_models.index.get();

		if (error) {
			return console.log(error);
		}

		console.log('retrieved ' + data.length + ' things');
		console.log('data is ' + JSON.stringify(data))

		this.#systemModels.current = data;
	}

	get systemModels() {
		return this.#systemModels.current;
	}
}

export const systemModelStore = new SystemModelStore();
