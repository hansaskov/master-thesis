
import { page } from '$app/stores';
import { treaty } from '@elysiajs/eden';
import type { App } from 'backend';
import type { Types } from 'backend/src/db/tables';

// Get the hostname of the current web page
const hostname = window.location.hostname;

const api = treaty<App>(hostname).api;

export class OrganizationStore {
    public organizations = $state<Types.Organization.Select[]>([])

    async update() {
        const {data, error} = await api.organizations.index.get()
		console.log("data:", data)
		console.log("error:", error)

		if (data) {
			this.organizations = data
		}
    }

    async add(name: string) {
        const {data, error} = await api.organizations.index.post({ name })

        if (error) {
            console.error(error)
            return
        }

        this.organizations.push(data)
    }

    async remove(id: string) {
        const {data, error} = await api.organizations.index.delete({ id })

        if (error) {
            console.error(error)
            return
        }

        this.organizations = this.organizations.filter((v) => v.id !== id);
    }

    async edit(values: Types.Organization.Update) {
        const {data, error} = await api.organizations.index.patch(values)

        if (error) {
            console.error(error)
            return
        }

        this.organizations = this.organizations.filter((v) => v.id !== values.id);
        this.organizations.push(data);
    }

}

export const organizationStore = new OrganizationStore()