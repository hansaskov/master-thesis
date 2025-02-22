import { goto } from '$app/navigation';
import { api } from '$lib/api';
import { onError } from '$lib/error';
import type { Types } from 'backend';
import { toast } from 'svelte-sonner';
import { PersistedState } from 'runed';

class UserStore {
	public user: Types.User | null = $state(null);
	public userRelation: Types.UserToOrganization | undefined = $state(undefined);
	public isAdmin = $derived(this.user?.is_superadmin ?? false);
	private nonAuthorizedRedirectUrl = '/';
	public superAdminUsers = new PersistedState<Types.User[]>('superadmins', []);

	constructor() {
		this.refresh();
	}

	public async refresh() {
		const { data, error } = await api.status.refresh.get();

		if (error) {
			return;
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

	public async loadSuperAdmins() {
        const { data, error } = await api.users.superAdmins.get();
        
		console.log(data);

        if (error) {
            onError(error);
            return;
        }

        if (data) {
            this.superAdminUsers.current = data;
        }
    }
}

export const userStore = new UserStore();
