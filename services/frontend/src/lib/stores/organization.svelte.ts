import { api } from '$lib/api';
import type { Types } from 'backend';

export class OrganizationStore {
	public organizations = $state<Types.Organization[]>([]);

	async update() {
		const { data, error } = await api.organizations.index.get();

		if (error) {
			console.error(error);
			return;
		}

		this.organizations = data;
	}

	async add(name: string) {
		const { data, error } = await api.organizations.index.post({ name });

		if (error) {
			console.error(error);
			return;
		}

		this.organizations.push(data);
	}

	async remove(id: string) {
		const { data, error } = await api.organizations.index.delete({ id });

		if (error) {
			console.error(error);
			return;
		}

		this.organizations = this.organizations.filter((v) => v.id !== id);
	}

	async edit(values: Types.OrganizationUpdate) {
		const { data, error } = await api.organizations.index.patch(values);

		if (error) {
			console.error(error);
			return;
		}

		this.organizations = this.organizations.filter((v) => v.id !== values.id);
		this.organizations.push(data);
	}
}

export const organizationStore = new OrganizationStore();
