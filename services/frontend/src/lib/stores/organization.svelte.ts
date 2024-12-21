import { api } from '$lib/api';
import { onError } from '$lib/error';
import type { Types } from 'backend';
import type { StrictPick } from 'backend/src/types/strict';
import { PersistedState } from 'runed';
import { toast } from 'svelte-sonner';
import { page } from '$app/state';

export class OrganizationStore {
	// PersistedState will immidiatly fetch values from localstorage.
	#organizations = new PersistedState<Types.Organization[]>('organizations', []);
	public currentOrganization = $derived(
		this.#organizations.current.find((org) => org.id === page.params.organizationId)
	);

	// Private helper functions for adding, removing and deleting from list of organizations.
	// All private helper functions will return the affected organization before changes are made to it.
	#add(organization: Types.Organization) {
		this.#organizations.current.push(organization);
		return organization;
	}

	#remove(organization: StrictPick<Types.Organization, 'id'>) {
		const index = this.#organizations.current.findIndex((org) => org.id === organization.id);
		return index !== -1 ? this.#organizations.current.splice(index, 1)[0] : undefined;
	}

	#edit(id: string, update: Types.OrganizationUpdate) {
		const index = this.#organizations.current.findIndex((org) => org.id === id);
		if (index === -1) return undefined;

		const previous = this.#organizations.current[index];
		this.#organizations.current[index] = { ...previous, ...update }; // current must be set after previous to correctly override the values.
		return previous;
	}

	// Public methods for interacting with organization state.
	// They all implement optimistic updates. State changes are therefore instant and snappy
	async refresh() {
		const { data, error } = await api.organizations.index.get();

		if (error) {
			return console.log(error);
		}

		this.#organizations.current = data;
	}

	async add(organization: Types.OrganizationNew) {
		const temporaryOrganization = this.#add({
			id: 'temp_id_abcdefghijklmnop',
			...organization
		});

		const { data, error } = await api.organizations.index.post(organization);

		if (error) {
			this.#remove(temporaryOrganization);
			return onError(error);
		}

		this.#edit(temporaryOrganization.id, data);

		toast.success(`Successfully created ${data.name}`);
	}

	async remove({ id }: StrictPick<Types.Organization, 'id'>) {
		const removedOrganization = this.#remove({ id });

		const { data, error } = await api.organizations.index.delete({ id });

		if (error) {
			removedOrganization && this.#add(removedOrganization);
			return onError(error);
		}

		toast.success(`Organization ${data.name} has been removed`);
	}

	async edit(organization: Types.OrganizationUpdate) {
		const previousOrganization = this.#edit(organization.id, organization);

		const { data, error } = await api.organizations.index.patch(organization);

		if (error) {
			previousOrganization && this.#edit(organization.id, previousOrganization);
			return onError(error);
		}

		this.#edit(organization.id, data);
		toast.success(`Organization has been updated to ${data.name}`);
	}

	// Allows read only access directly to organizations
	get organizations() {
		return this.#organizations.current;
	}
}

export const organizationStore = new OrganizationStore();
