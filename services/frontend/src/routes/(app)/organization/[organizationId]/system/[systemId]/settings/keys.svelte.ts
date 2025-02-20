import { page } from '$app/state';
import { api } from '@/api';
import { onError } from '@/error';

type Keys = NonNullable<Awaited<ReturnType<typeof api.keys.index.get>>['data']>;
type KeysNew = Parameters<typeof api.keys.index.post>['0'];
type KeysDelete = Parameters<typeof api.keys.index.delete>['0'];
const systemId = $derived(page.params.systemId);
const defaultKey = $derived<KeysNew>({
	name: '',
	system_id: systemId
});

class KeysStore {
	constructor() {
		this.fetch();
	}

	#keys = $state<Keys>([]);
	newKey = $state<KeysNew>(defaultKey);

	async fetch() {
		const { data, error } = await api.keys.index.get({
			query: {
				system_id: systemId
			}
		});

		if (error) {
			return onError(error);
		}

		this.#keys = data;
	}

	async create() {
		const { data, error } = await api.keys.index.post(this.newKey);

		if (error) {
			return onError(error);
		}

		this.newKey = defaultKey;
		this.fetch();
		return data;
	}

	async delete(key: KeysDelete) {
		const { error } = await api.keys.index.delete(key)

		if (error) {
			return onError(error);
		}

		this.fetch()
	}


	public get keys() {
		return this.#keys;
	}
}

export const keysStore = new KeysStore();
