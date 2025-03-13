export function combineArraysAndAddIsCheckedForDublicates<T extends { id: string }>(
	arr1: T[],
	arr2: T[]
) {
	const idMap = new Map<string, T & { isChecked: boolean }>();

	// Process both arrays
	for (const item of [...arr1, ...arr2]) {
		const existing = idMap.get(item.id);

		if (existing) {
			// If this ID already exists, mark both as duplicates
			existing.isChecked = true;
			// We don't add the new item since we're keeping only one instance per ID
		} else {
			// First time seeing this ID
			idMap.set(item.id, { ...item, isChecked: false });
		}
	}

	return Array.from(idMap.values());
}
