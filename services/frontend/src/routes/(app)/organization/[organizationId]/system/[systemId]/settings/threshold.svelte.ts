import { page } from '$app/state';
import { api } from '@/api';
import { onError } from '@/error';
import { toast } from 'svelte-sonner';

type Threshold = NonNullable<Awaited<ReturnType<typeof api.threshold.index.get>>['data']>[number];
type AvailableThreshold = NonNullable<
	Awaited<ReturnType<typeof api.threshold.available.get>>['data']
>[number];
type ThresholdNew = Parameters<typeof api.threshold.index.put>['0'][number];
const system_id = $derived(page.params.systemId);

class ThresholdStore {
	#thresholds = $state<Threshold[]>([]);
	#available = $state<AvailableThreshold[]>([]);

	async fetchAll() {
		await Promise.allSettled([this.fetchThresholds(), this.fetchAvailable()]);
	}

	async fetchThresholds() {
		const { data, error } = await api.threshold.index.get({ query: { system_id } });

		if (error) {
			onError(error);
			return;
		}

		this.#thresholds = data;
	}

	async fetchAvailable() {
		const { data, error } = await api.threshold.available.get({ query: { system_id } });

		if (error) {
			onError(error);
			return;
		}

		this.#available = data;
	}

	async fetchThreshold() {
		const { data, error } = await api.threshold.available.get({ query: { system_id } });

		if (error) {
			onError(error);
			return;
		}

		this.#available = data;
	}

	async updateThreshold(values: ThresholdNew[]) {
		const { data, error } = await api.threshold.index.put(values);

		if (error) {
			onError(error);
			return;
		}

		toast.success(`Thresholds were successfully updated`);

		return data;
	}

	public get thresholds() {
		return this.#thresholds;
	}

	public get available() {
		return this.#available;
	}
}

export const thresholdStore = new ThresholdStore();
