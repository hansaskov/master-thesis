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

	// Weird name to not mix it up with user by accident
	public allUsers = new PersistedState<Types.User[]>('allUsers', []);

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

	public async loadAllUser() {
		const { data, error } = await api.users.index.get();

		console.log(data);
		if (error) {
			onError(error);
			return;
		}

		// sort them based on superadmin value
		data.sort((a, b) => (b.is_superadmin === a.is_superadmin ? 0 : b.is_superadmin ? 1 : -1));

		if (data) {
			this.allUsers.current = data;
		}
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

	public async edit(id: string, newValue: boolean) {
		// logic for upgrading a user
		if (newValue) {
			const { error } = await api.users.index.patch({ id, newValue });
	
			if (error) {
				onError(error);
				return;
			}
	
			this.allUsers.current = this.allUsers.current.map((user) => {
				if (user.id === id) {
					return { ...user, is_superadmin: newValue };
				}
				return user;
			});
			toast.success(`User has been updated to superadmin`);

		} 

		//logic for downgrading user
		if (!newValue) 
		{
			await this.loadSuperAdmins();

			if (this.superAdminUsers.current.length <= 1) {
				toast.success('User cannot be downgraded as there is only 1 superadmin')
			} else {
				const { error } = await api.users.index.patch({ id, newValue });
	
				if (error) {
					onError(error);
					return;
				}
		
				this.allUsers.current = this.allUsers.current.map((user) => {
					if (user.id === id) {
						return { ...user, is_superadmin: newValue };
					}
					return user;
				});
				toast.success('User has been downgraded from superadmin');
			}
			
		}

		console.log('Unreachable branch in User.edit');
	}
}

export const userStore = new UserStore();
