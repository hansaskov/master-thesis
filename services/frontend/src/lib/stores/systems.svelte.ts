import { api } from '$lib/api';
import { onError } from '$lib/error';
import type { Types } from 'backend';
import { toast } from 'svelte-sonner';

export class SystemStore {
    public systems = $state<Types.System[]>([]);

	async selectAll() {
		const { data, error } = await api.systems.index.get();

		if (error) {
			return console.log(error);
		}

		this.systems = data;
	}

    async add(name: string, organization_id: string, system_model_id?: string | null) {
		const { data, error } = await api.systems.index.post({ name, organization_id, system_model_id });

		if (error) {
			return onError(error);
		}

		toast.success(`Successfully created ${data.name}`);

		this.systems.push(data);
	}

	async delete(id: string) {
		const { data, error} = await api.systems.index.delete({ id });

		if (error) {
			return onError(error)
		}

		toast.success(`Successfully deleted ${data.name}`);

		this.systems = this.systems.filter((v) => v.id !== id);
	}

}

export const systemStore = new SystemStore();