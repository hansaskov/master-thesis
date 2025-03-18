import { api } from '$lib/api';
import { onError } from '$lib/error';
import type { Types } from 'backend';
// import type { StrictPick } from 'backend/src/types/strict';
// import { PersistedState } from 'runed';
import { toast } from 'svelte-sonner';

export class SystemsToPartsStore {
	async add(relation: Types.SystemToPartsNew) {
		const { data, error } = await api.systems_to_parts.index.post(relation);
		if (error) {
			return onError(error);
		}

		toast.success(`Successfully created relation between ${data.parts_id} and ${data.system_id}`);
	}

	async addBatch(relations: Types.SystemToPartsNew[]) {
		if (relations.length === 0) return;

		const { error } = await api.systems_to_parts.batch.post(relations);

		if (error) {
			return onError(error);
		}

		toast.success('Successfully created relations between system and parts');
	}
}

export const systemsToPartsStore = new SystemsToPartsStore();
