import { page } from '$app/state';
import type { StrictOmit } from '$types/strict';
import { api } from '@/api';
import { onError } from '@/error';
import { getFirstDistinctValues } from '@/utils';

type Readings = NonNullable<Awaited<ReturnType<typeof api.readings.get>>['data']>;
type ReadingsQueryParams = Parameters<typeof api.readings.get>['0']['query'];

const systemId = $derived(page.params.systemId);

class MonitorStore {
	#readings = $state<Readings>([]);
	#latestReadings = $derived(
		getFirstDistinctValues(this.#readings.toReversed(), ['category', 'name'])
	);

	async refresh(query: StrictOmit<ReadingsQueryParams, 'system_id'>) {
		if (!systemId) {
			console.warn('monitor store refresh returned early');
			return;
		}

		const { data, error } = await api.readings.get({
			query: {
				system_id: systemId,
				...query
			}
		});

		if (error) {
			return onError(error);
		}

		this.#readings = data;
	}

	public get readings() {
		return this.#readings;
	}

	public get latestReadings() {
		return this.#latestReadings;
	}
}

export const monitorStore = new MonitorStore();
