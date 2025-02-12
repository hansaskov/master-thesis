import { api } from '$lib/api';
import { onError } from '$lib/error';
import type { Types } from 'backend';
import { toast } from 'svelte-sonner';
import { PersistedState } from 'runed';
import type { StrictPick } from 'backend/src/types/strict';

export class SystemStore {
	#systems = new PersistedState<Types.System[]>('systems', [], {
		storage: 'session',
		syncTabs: false
	});

	#add(system: Types.System) {
		this.#systems.current.push(system);
		return system;
	}

	#remove(system: StrictPick<Types.System, 'id'>) {
		const index = this.#systems.current.findIndex((sys) => sys.id === system.id);
		return index !== -1 ? this.#systems.current.splice(index, 1)[0] : undefined;
	}

	async refresh() {
		const { data, error } = await api.systems.get_on_org_id.get();

		if (error) {
			return console.log(error);
		}

		this.#systems.current = data;
	}

	async selectAll() {
		const { data, error } = await api.systems.index.get();

		if (error) {
			return console.log(error);
		}

		this.#systems.current = data;
	}

	async add(newSystem: Types.SystemNew) {
		const { data, error } = await api.systems.index.post(newSystem);

		if (error) {
			return onError(error);
		}

		toast.success(`Successfully created ${data.name}`);

		this.systems.push(data);
	}

	async delete({ id }: StrictPick<Types.System, 'id'>) {
		const removedSystem = this.#remove({ id });

		const { data, error } = await api.systems.index.delete({ id });

		if (data) {
			toast.success(`System ${data.name} has been removed`);
			return;
		}

		if (error && removedSystem) {
			this.#add(removedSystem);
			return onError(error);
		}

		// const { data, error } = await api.systems.index.delete({ id });

		// if (error) {
		// 	return onError(error);
		// }

		// toast.success(`Successfully deleted ${data.name}`);

		// this.#systems = this.#systems.#filter((v) => v.id !== id);
	}

	get systems() {
		return this.#systems.current;
	}
}

export const systemStore = new SystemStore();
