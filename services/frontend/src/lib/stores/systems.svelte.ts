import { api } from '$lib/api';
import { onError } from '$lib/error';
import type { Types } from 'backend';
import { toast } from 'svelte-sonner';

export class SystemStore {
    public systems = $state<Types.System[]>([]);

    async add(name: string, organization_id: String) {
		const { data, error } = await api.systems.index.post({ name, organization_id });

		if (error) {
			return onError(error);
		}

		toast.success(`Successfully created ${data.name}`);

		this.systems.push(data);
	}
}

export const systemStore = new SystemStore();