
// Generic ListManager class to handle CRUD operations on a list of items
export class ListManager<T extends { id: string }> {

	protected items = $state<T[]>([])

	// Add a new item to the list
	protected insert(item: T): T {
		this.items.push(item);
		return item;
	}

	// Remove an item by its ID and return the removed item (or undefined if not found)
	protected delete(id: string): T | undefined {
		const index = this.items.findIndex((item) => item.id === id);
        if (index === -1) return undefined;
		return this.items.splice(index, 1)[0]
	}

	// Update an item by its ID, applying updates, and return the previous state (or undefined if not found)
	protected update<U extends Partial<T>>(id: string, update: U): T | undefined {
		const index = this.items.findIndex((item) => item.id === id);
		if (index === -1) return undefined;

		const previous = this.items[index];
		this.items[index] = { ...previous, ...update };
		return previous;
	}

	// Get the current list of items (useful for reactivity in Svelte)
	get current(): T[] {
		return this.items;
	}
}
