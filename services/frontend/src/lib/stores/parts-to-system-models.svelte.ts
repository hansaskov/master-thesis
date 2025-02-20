import { api } from '$lib/api';
import { onError } from '$lib/error';
import type { Types } from 'backend';
// import type { StrictPick } from 'backend/src/types/strict';
// import { PersistedState } from 'runed';
import { toast } from 'svelte-sonner';

export class PartsToSystemModelsStore {
	async add(relation: Types.PartToSystemModelNew) {
		const { data, error } = await api.parts_to_system_models.index.post(relation);
		if (error) {
			return onError(error);
		}

		toast.success(
			`Successfully created relation between ${data.part_id} and ${data.system_model_id}`
		);
	}

	async delete(relation: Types.PartToSystemModel) {
		const { data, error } = await api.parts_to_system_models.index.delete(relation);
		if (error) {
			return onError(error);
		}
		toast.success(
			`Successfully deleted relation between ${data?.part_id} and ${data?.system_model_id}`
		);
	}

	async batchUpdate(updates: {
		additions: Array<{ part_id: string; system_model_id: string }>;
		deletions: Array<{ part_id: string; system_model_id: string }>;
	}) {
		const { data, error } = await api.parts_to_system_models.batch.post(updates);
		if (error) {
			return onError(error);
		}

		const addedCount = data.additions.length;
		const deletedCount = data.deletions.length;
		const message = [
			addedCount > 0 && `Added ${addedCount} relation(s)`,
			deletedCount > 0 && `Removed ${deletedCount} relation(s)`
		]
			.filter(Boolean)
			.join(', ');

		if (message) {
			toast.success(`Batch update successful: ${message}`);
		}

		return data;
	}
}

export const partsToSystemModelStore = new PartsToSystemModelsStore();
