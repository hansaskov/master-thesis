import { api } from '$lib/api';
import { onError } from '$lib/error';
import type { Types } from 'backend';
import { toast } from 'svelte-sonner';
import { page } from '$app/state';
import { ListManager } from './listmanager.svelte';

class OrganizationStore extends ListManager<Types.Organization> {
	constructor() {
		super();
        this.refresh();
	}

	public currentOrganization = $derived(
		this.items.find(org => org.id === page.params.organizationId)
	);

	async refresh() {
		const { data, error } = await api.organizations.index.get();

		if (error) {
			return console.log(error);
		}

		this.items = data;
	}

	async add(organization: Types.OrganizationNew) {
		const tempId = 'temporary_id';
		super.insert({ id: tempId, ...organization });

		const { data, error } = await api.organizations.index.post(organization);

		if (error) {
			super.delete(tempId);
			return onError(error);
		}

		super.update(tempId, data);

		toast.success(`Successfully created ${data.name}`);
	}

        async remove(id: string) {
            const removedOrganization = super.delete( id );
    
            const { data, error } = await api.organizations.index.delete({ id });
    
            if (data) {
                toast.success(`Organization ${data.name} has been removed`);
                return;
            }
    
            if (error && removedOrganization) {
                super.insert(removedOrganization);
                return onError(error);
            }
    
            console.log('Unreachable branch in Organization.remove');
        }

        async edit(organization: Types.OrganizationUpdate) {
            const previousOrganization = super.update(organization.id, organization);
    
            const { data, error } = await api.organizations.index.patch({ ...organization });
    
            if (data) {
                super.update(organization.id, data);
                toast.success(`Organization has been updated to ${data.name}`);
                return;
            }
    
            if (error && previousOrganization) {
                super.update(organization.id, previousOrganization);
                return onError(error);
            }
    
            console.log('Unreachable branch in Organization.edit');
        }

		get organizations() {
			return this.items;
		}
}

export const organizationStore = new OrganizationStore();

