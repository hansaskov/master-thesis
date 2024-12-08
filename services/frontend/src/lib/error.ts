import { toast } from 'svelte-sonner';

export function onError(error: string | { value: string } | { value: unknown } | null) {
	if (error) {
		console.error(error);

		if (typeof error === 'string') {
			toast.error(error);
		} else if ('value' in error && typeof error.value === 'string') {
			toast.error(error.value);
		} else {
			toast.error('Unknown error occured');
		}
	}
}
