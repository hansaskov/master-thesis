// Generic ListManager class to handle CRUD operations on a list of items
export class ListManager<T extends { id: string }> {
	protected items = $state<T[]>([]);

	// Add a new item to the list
	protected insert(item: T): T {
		this.items.push(item);
		return item;
	}

	// Remove an item by its ID and return the removed item (or undefined if not found)
	protected delete(id: string): T | undefined {
		const index = this.items.findIndex((item) => item.id === id);
		if (index === -1) return undefined;
		return this.items.splice(index, 1)[0];
	}

	// Update an item by its ID, applying updates, and return the previous state (or undefined if not found)
	protected update<U extends Partial<T>>(id: string, update: U): T | undefined {
		const index = this.items.findIndex((item) => item.id === id);
		if (index === -1) return undefined;

		const previous = this.items[index];
		this.items[index] = { ...previous, ...update };
		return previous;
	}

	protected optimisticInsert<
		TData,
		TError,
		MutationFn extends (item: T) => Promise<{ data?: TData; error?: TError }>
	>(options: {
		mutationFn: MutationFn;
		onError: (error: NonNullable<Awaited<ReturnType<MutationFn>>['error']>) => void;
		onSuccess: (data: NonNullable<Awaited<ReturnType<MutationFn>>['data']>) => void;
	}) {
		return (item: Parameters<MutationFn>[0]): Promise<TData | void> => {
			return (async () => {
				// Optimistically insert the item
				const tempId = `temp_${Date.now()}_${Math.random()}`;
				this.insert({ ...item, id: tempId });

				// Actually insert the item in the db
				const { data, error } = await options.mutationFn(item);

				// Handle Error case
				if (error) {
					this.delete(tempId);
					options.onError(error);
					return;
				}

				// Handle Success case
				if (data) {
					this.update(tempId, data);
					options.onSuccess(data);
					return data;
				}
			})();
		};
	}

	protected optimisticDelete<
		TData,
		TError,
		MutationFn extends (params: { id: string }) => Promise<{ data?: TData; error?: TError }>
	>(options: {
		mutationFn: MutationFn;
		onError: (error: NonNullable<Awaited<ReturnType<MutationFn>>['error']>) => void;
		onSuccess: (data: NonNullable<Awaited<ReturnType<MutationFn>>['data']>) => void;
	}) {
		return (id: string): Promise<TData | void> => {
			return (async () => {
				// Store the item before deletion for potential rollback
				const removedItem = this.delete(id);

				// If nothing was actually deleted, exit early
				if (!removedItem) return;

				// Perform the actual deletion in the db
				const { data, error } = await options.mutationFn({ id });

				// Handle Error case
				if (error) {
					// Rollback by reinserting the removed item
					this.insert(removedItem);
					options.onError(error);
					return;
				}

				// Handle Success case
				if (data) {
					options.onSuccess(data);
					return data;
				}
			})();
		};
	}

	protected optimisticEdit<
		TData,
		TError,
		TUpdate extends Partial<T>,
		MutationFn extends (item: TUpdate & { id: string }) => Promise<{ data?: TData; error?: TError }>
	>(options: {
		mutationFn: MutationFn;
		onError: (error: NonNullable<Awaited<ReturnType<MutationFn>>['error']>) => void;
		onSuccess: (data: NonNullable<Awaited<ReturnType<MutationFn>>['data']>) => void;
	}) {
		return (update: TUpdate & { id: string }): Promise<TData | void> => {
			return (async () => {
				// Store the previous state before update for potential rollback
				const previousItem = this.update(update.id, update);

				// If nothing was actually updated, exit early
				if (!previousItem) return;

				// Perform the actual update in the db
				const { data, error } = await options.mutationFn(update);

				// Handle Error case
				if (error) {
					// Rollback to the previous state
					this.update(update.id, previousItem);
					options.onError(error);
					return;
				}

				// Handle Success case
				if (data) {
					// Update with the returned data from the server
					this.update(update.id, data);
					options.onSuccess(data);
					return data;
				}
			})();
		};
	}

	// Get the current list of items (useful for reactivity in Svelte)
	get current(): T[] {
		return this.items;
	}
}
