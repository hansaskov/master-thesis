
import { page } from '$app/stores';
import { treaty } from '@elysiajs/eden';
import type { App } from 'backend';
import type { Types } from 'backend/src/db/tables';

// Get the hostname of the current web page
const hostname = window.location.hostname;

const api = treaty<App>(hostname).api;

export class Organization {
    organizations = $state<Types.Organization.Select[]>([
        { id: 'org1', name: 'TriVision' },
        { id: 'org2', name: 'Organization 2' },
        { id: 'org3', name: 'Organization 3' }
    ])

    async update() {
        const {data, error} = await api.organizations.index.get()
		console.log("data:", data)
		console.log("error:", error)

		if (data) {
			this.organizations = data
		}
    }

    async create(name: string) {
        const {data, error} = await api.organizations.index.post({ name })

        if (error) {
            console.error(error)
            return
        }

        this.organizations.push(data)
        
    }
}