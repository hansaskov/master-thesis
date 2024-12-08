import { api } from '$lib/api';
import { onError } from '$lib/error';
import type { Types } from 'backend';
import { toast } from 'svelte-sonner';

export class OrganizationStore {
	public organizations = $state<Types.Organization[]>([]);

	async update() {
		const { data, error } = await api.organizations.index.get();

		if (error) {
			return onError(error);
		}

		this.organizations = data;
	}

	async add(name: string) {
		const { data, error } = await api.organizations.index.post({ name });

		if (error) {
			return onError(error);
		}

		toast.success(`Successfully created ${data.name}`);

		this.organizations.push(data);
	}

	async remove(id: string) {
		const { data, error } = await api.organizations.index.delete({ id });

		if (!data) {
			return onError(error);
		}

		toast.success(`Organization \"${data.name}\" has been removed`);
		this.organizations = this.organizations.filter((v) => v.id !== id);
	}

	async edit(values: Types.OrganizationUpdate) {
		const { data, error } = await api.organizations.index.patch(values);

		if (error) {
			return onError(error);
		}

		this.organizations = this.organizations.filter((v) => v.id !== values.id);
		this.organizations.push(data);
	}
}

export const organizationStore = new OrganizationStore();
