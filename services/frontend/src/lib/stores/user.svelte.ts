import { goto } from '$app/navigation';
import { api } from '$lib/api';
import { onError } from '$lib/error';
import type { Types } from 'backend';
import { toast } from 'svelte-sonner';

class UserStore {
	public user: Types.User | null = $state(null);
	public userRelation: Types.UserToOrganization | undefined = $state(undefined);
	public isAdmin = $derived(this.user?.is_superadmin ?? false);
	private nonAuthorizedRedirectUrl = '/';

	constructor() {
		this.refresh();
	}

	public async refresh() {
		const { data, error } = await api.status.refresh.get();

		if (error) {
			onError(`Authentication failed. Redirecting to ${this.nonAuthorizedRedirectUrl}`);
			return goto(this.nonAuthorizedRedirectUrl);
		}

		this.user = data.user;
		this.userRelation = data.relation;
	}

	public async logout() {
		const { error } = await api.logout.get();

		if (error) {
			onError(error);
		}

		toast.success('Successfully logged out');
		goto(this.nonAuthorizedRedirectUrl);
	}
}

export const userStore = new UserStore();
