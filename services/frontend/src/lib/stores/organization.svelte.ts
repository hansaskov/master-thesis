import { api } from '$lib/api';
import type { Types } from 'backend';
import { toast } from 'svelte-sonner';

export class OrganizationStore {
	public organizations = $state<Types.Organization[]>([]);


    private onError(error: {status: number, value: string} |{status: unknown, value: unknown} | null) {
        if (error) {
            console.error(error)
            if ('value' in error && typeof error.value === 'string') {
                toast.error(error.value);
            } else {
                toast.error("Unknown error occured")
            }
        }
    }

	async update() {
		const { data, error } = await api.organizations.index.get();

        if (error) {
			return this.onError(error)
		}

        

		this.organizations = data;
	}

	async add(name: string) {
		const { data, error } = await api.organizations.index.post({ name });

		if (error) {
			return this.onError(error)
		}

        toast.success(`Successfully created ${data.name}`)

		this.organizations.push(data);
	}

	async remove(id: string) {
		const { data, error } = await api.organizations.index.delete({ id });

		if (!data ) {
            
			return this.onError(error)
		}

        toast.success(`Organization \"${data.name}\" has been removed`)
		this.organizations = this.organizations.filter((v) => v.id !== id);
	}

	async edit(values: Types.OrganizationUpdate) {
		const { data, error } = await api.organizations.index.patch(values);

		if (error) {
			return this.onError(error)
		}

        
		this.organizations = this.organizations.filter((v) => v.id !== values.id);
		this.organizations.push(data);
	}
}

export const organizationStore = new OrganizationStore();
