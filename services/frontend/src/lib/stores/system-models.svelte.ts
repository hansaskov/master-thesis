import { api } from '$lib/api';
import { onError } from '@/error';
import type { Types } from 'backend';
import { PersistedState } from 'runed';

export interface SystemModelWithParts extends Types.SystemModel {
	parts: Array<{
		id: string;
		name: string;
		image: string | null;
	}>;
}

type AssingParts = Parameters<typeof api.parts_to_system_models.overwrite.patch>['0'];

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

	async assignParts(values: AssingParts) {
		const { error } = await api.parts_to_system_models.overwrite.patch(values);

		if (error) {
			return onError(error);
		}

		await this.refresh();
	}

	get systemModels() {
		return this.#systemModels.current;
	}
}

export const systemModelStore = new SystemModelStore();
