import { goto } from '$app/navigation';
import { toast } from 'svelte-sonner';

export function onError(error: string | { value: string } | { value: unknown } | null) {
	if (error) {
		console.log(JSON.stringify(error, null, 4));

		if (typeof error === 'string') {
			toast.error(error);
		} else if ('value' in error && typeof error.value === 'string') {
			toast.error(error.value);
			if (error.value === 'You must pass a valid session id') {
				goto('/');
			}
		} else if (
			'value' in error &&
			typeof error.value === 'object' &&
			error.value &&
			'message' in error.value &&
			typeof error.value.message === 'string'
		) {
			toast.error(error.value.message);
		} else {
			toast.error('Unknown error occured');
		}
	}
}
