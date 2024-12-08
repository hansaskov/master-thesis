import { goto } from '$app/navigation';
import { api } from '$lib/api';
import { onError } from '$lib/error';
import type { Types } from 'backend';
import { toast } from 'svelte-sonner';


class UserStore {

    public user: Types.User | null = $state(null)

    private nonAuthorizedRedirectUrl = "/";
    private authorizedRedirectUrl = "/systems"

    public async login(provider: Types.User['provider_name']) {

        // We onlt support one provider of microsof as of now. 
        // Hardcode to use microsoft. But can be updated to use more that one. 
        if (provider === "Github") {
            return onError(`Authentication with ${provider} is currently not supported`)
        }


        const {data, error} = await api.login["microsoft"].get()

        if (error) {
            return onError(error);
        }

        if (data.redirected) {
            toast.success("Redirecting to Microsoft")
        }
        

    }

    public async logout() {

    }

    public async refresh() {

        const {data, error} = await api.refresh.get();

        toast("Calling refresh")

        if (error) {
            onError(`Authentication failed. Redirecting to ${this.nonAuthorizedRedirectUrl}`);
            return goto(this.nonAuthorizedRedirectUrl)
        }
        this.user = data

        toast.success(`Welcome user with if \"${data.provider_id}\"`)
    }
}

export const userStore = new UserStore();