
import { page } from '$app/stores';
import { treaty } from '@elysiajs/eden';
import type { App } from 'backend';

// Get the hostname of the current web page
const hostname = window.location.hostname;

const api = treaty<App>(hostname).api;

class Organization {
    organizations = $state([])


    async update() {
        const {data, error} = await api.organizations.index.get()
		console.log("data:", data)
		console.log("error:", error)

		if (data) {
			this.organizations = data
		}
    }
}