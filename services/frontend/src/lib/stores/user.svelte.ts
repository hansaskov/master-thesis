import { goto } from '$app/navigation';
import { api } from '$lib/api';
import { onError } from '$lib/error';
import type { Types } from 'backend';
import { toast } from 'svelte-sonner';

class UserStore {
	public user: Types.User | null = $state(null);
	public isLoading = $state(false);

	private nonAuthorizedRedirectUrl = '/';
	private authorizedRedirectUrl = '/systems';

	public async login(provider: Types.User['provider_name']) {
		// We onlt support one provider of microsof as of now.
		// Hardcode to use microsoft. But can be updated to use more that one.
		if (provider === 'Github') {
			return onError(`Authentication with ${provider} is currently not supported`);
		}

		const { data, error } = await api.login['microsoft'].get();

		if (error) {
			return onError(error);
		}

		toast.success('Redirecting to Microsoft');
		goto(this.authorizedRedirectUrl);
	}

	public async logout() {
		const { data, error } = await api.logout.get();

		if (error) {
			onError(error);
		}

		toast.success('Successfully logged out');
		goto(this.nonAuthorizedRedirectUrl);
	}

	public async refresh() {
		this.isLoading = true;
		const { data, error } = await api.refresh.get();
		this.isLoading = false;

		if (error) {
			onError(`Authentication failed. Redirecting to ${this.nonAuthorizedRedirectUrl}`);
			goto(this.nonAuthorizedRedirectUrl);
		}

		this.user = data;
	}
}

export const userStore = new UserStore();
