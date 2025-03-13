import { api } from '$lib/api';
import { onError } from '$lib/error';
import type { Types } from 'backend';
import type { StrictPick } from 'backend/src/types/strict';
import { PersistedState } from 'runed';
import { toast } from 'svelte-sonner';

export class PartsStore {
	#parts = new PersistedState<Types.Part[]>('parts', []);

	async refresh() {
		const { data, error } = await api.parts.index.get();

		if (error) {
			return onError(error);
		}

		this.#parts.current = data;
	}

	async add(part: Types.PartNew) {
		const { data, error } = await api.parts.index.post(part);

		if (error) {
			return onError(error);
		}

		toast.success(`Successfully created ${data.name}`);
		this.#parts.current.push(data);
	}

	async remove({ id }: StrictPick<Types.Part, 'id'>) {
		const { data: partData, error: partError } = await api.parts.index.delete({ id });

		if (partData) {
			toast.success(`Part ${partData.name} has been removed`);
			return;
		}

		if (partError) {
			return onError(partError);
		}

		console.log('Unreachable branch in Parts.remove');
	}

	async edit(part: Types.PartUpdate) {
		const { data, error } = await api.parts.index.patch(part);

		if (data) {
			toast.success(`Part has been updated to ${data.name}`);
			return;
		}

		if (error) {
			return onError(error);
		}

		console.log('Unreachable branch in Parts.edit');
	}

	get parts() {
		return this.#parts.current;
	}
}

export const partsStore = new PartsStore();
