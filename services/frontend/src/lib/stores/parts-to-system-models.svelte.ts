import { api } from '$lib/api';
import { onError } from '$lib/error';
import type { Types } from 'backend';
// import type { StrictPick } from 'backend/src/types/strict';
// import { PersistedState } from 'runed';
import { toast } from 'svelte-sonner';

export class PartsToSystemModelsStore {
    async add(relation: Types.PartToSystemModelNew) {
        const { data, error } = await api.parts_to_system_models.index.post(relation)
        if (error) {
            return onError(error);
        }

        toast.success(`Successfully created relation between ${data.part_id} and ${data.system_model_id}`)
    }

    async delete(relation: Types.PartToSystemModel) {
        const { data, error } = await api.parts_to_system_models.index.delete(relation)
        if (error) {
            return onError(error);
        }
        toast.success(`Successfully deleted relation between ${data?.part_id} and ${data?.system_model_id}`)
    }
}

export const partsToSystemModelStore = new PartsToSystemModelsStore();