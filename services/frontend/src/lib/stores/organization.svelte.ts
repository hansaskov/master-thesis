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
		this.items.find((org) => org.id === page.params.organizationId)
	);

	async refresh() {
		const { data, error } = await api.organizations.index.get();

		if (error) {
			return console.log(error);
		}

		this.items = data;
	}

	public add = super.optimisticInsert({
		mutationFn: api.organizations.index.post,
		onError: (error) => onError(error),
		onSuccess: (data) => toast.success(`Successfully created ${data.name}`)
	});

	public remove = super.optimisticDelete({
		mutationFn: api.organizations.index.delete,
		onError: (error) => onError(error),
		onSuccess: (data) => toast.success(`Organization ${data.name} has been removed`)
	});

	public edit = super.optimisticEdit({
		mutationFn: api.organizations.index.patch,
		onError: (error) => onError(error),
		onSuccess: (data) => toast.success(`Organization has been updated to ${data.name}`)
	});

	get organizations() {
		return this.items;
	}
}

export const organizationStore = new OrganizationStore();
