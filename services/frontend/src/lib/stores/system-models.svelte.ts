import { api } from '$lib/api';
//import { onError } from '$lib/error';
import type { Types } from 'backend';
import { PersistedState } from 'runed';
//import { toast } from 'svelte-sonner';

export class SystemModelStore {
	#systemModels = new PersistedState<Types.SystemModels[]>('systemModels', [], {
        storage: 'session',
        syncTabs: false
    })

    async refresh() {
        const { data, error } = await api.system_models.get();

        if (error) {
            return console.log(error);
        }

		console.log('retrieved ' + data.length + ' things')

        this.#systemModels.current = data;
    }

	get systemModels() {
		return this.#systemModels.current;
	}
}

export const systemModelStore = new SystemModelStore();