import { api } from '$lib/api';
import { onError } from '$lib/error';
import type { Types } from 'backend';
import type { StrictPick } from 'backend/src/types/strict';
import { PersistedState } from "runed";
import { toast } from 'svelte-sonner';
import { page } from '$app/state'

export class PartsStore {
	// PersistedState will immidiatly fetch values from localstorage.
    #parts = new PersistedState<Types.Part[]>("parts", []);

	// Private helper functions for adding, removing and deleting from list of parts. 
	// All private helper functions will return the affected part before changes are made to it. 
    #add(part: Types.Part) {
        this.#parts.current.push(part);
        return part;
    }

    #remove(part: StrictPick<Types.Part, "id">) {
        const index = this.#parts.current.findIndex(v => v.id === part.id);
        return index !== -1 ? this.#parts.current.splice(index, 1)[0] : undefined;
    }

	#edit(id: string, update: Types.PartUpdate) {
        const index = this.#parts.current.findIndex(v => v.id === id);
        if (index === -1) return undefined;

		const previous = this.#parts.current[index]
		this.#parts.current[index] = {...previous, ...update } // current must be set after previous to correctly override the values. 
		return previous
	}

	// Public methods for interacting with par state. 
	// They all implement optimistic updates. State changes are therefore instant and snappy 
	async refresh() {
		const { data, error } = await api.parts.index.get();

		if (error) {
			return console.log(error);
		}

		this.#parts.current = data;
	}

	async add(part: Types.PartNew) {

		const temporaryPart = this.#add({
			id: "temp_id_abcdefghijklmnop",
			...part
		});

		const { data, error } = await api.parts.index.post(part);

		if (error) {
			this.#remove(temporaryPart)
			return onError(error);
		}

		this.#edit(temporaryPart.id, data)

		toast.success(`Successfully created ${data.name}`);		
	}

	async remove({ id }: StrictPick<Types.Part, "id">) {

		const removed = this.#remove({id});

		const { data, error } = await api.parts.index.delete({ id });

		if (error) {

			removed && this.#add(removed);
			return onError(error);
		}

		toast.success(`Part ${data.name} has been removed`);
	}

	
	async edit(part: Types.PartUpdate) {

		const previous = this.#edit(part.id, part)

		const { data, error } = await api.parts.index.patch(part);

		if (error) {
			previous && this.#edit(part.id, previous);
			return onError(error);
		}

		this.#edit(part.id, data)
		toast.success(`Organization has been updated to ${data.name}`);
	}
	

	// Allows read only access directly to organizations
	get parts() {
		return this.#parts.current;
	}

}

export const partsStore = new PartsStore();
