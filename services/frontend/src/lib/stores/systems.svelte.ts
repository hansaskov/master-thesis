import { api } from '$lib/api';
import { onError } from '$lib/error';
import type { Types } from 'backend';
import { toast } from 'svelte-sonner';
import { PersistedState } from 'runed';
import type { StrictPick } from 'backend/src/types/strict';
import { page } from '$app/state';

type SystemWithHealth = NonNullable<
	Awaited<ReturnType<typeof api.systems.get_on_org_id.get>>['data']
>[number];

export class SystemStore {
	#systems = new PersistedState<SystemWithHealth[]>('systems', [], {
		storage: 'session',
		syncTabs: false
	});

	currentSystem = $derived(this.systems.find((system) => system.id === page.params.systemId));

	#add(system: SystemWithHealth) {
		this.#systems.current.push(system);
		return system;
	}

	#remove(system: StrictPick<SystemWithHealth, 'id'>) {
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

		this.systems.push({ ...data, latest_readings: null });

		return data;
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
	}

	async update(system: Types.SystemUpdate) {
		const { data, error } = await api.systems.index.patch(system);

		if (error) {
			return onError(error);
		}

		toast.success(`Successfully updated System ${data?.name}`);
		await this.refresh();
	}

	get systems() {
		return this.#systems.current;
	}
}

export const systemStore = new SystemStore();
