import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function groupBy<T, K extends keyof T>(array: T[], key: K) {
	const map = new Map<T[K], T[]>();
	for (const item of array) {
		const itemKey = item[key];
		if (!map.has(itemKey)) {
			map.set(
				itemKey,
				array.filter((i) => i[key] === item[key])
			);
		}
	}
	return map;
}

export function getFirstDistinctValues<T, K extends keyof T>(list: T[], keys: K[]): T[] {
	const seen = new Set<string>();
	const result: T[] = [];

	for (const item of list) {
		// Create a unique key by combining values of the specified keys
		const uniqueKey = keys
			.map((key) => {
				const value = item[key];
				// Handle different types of values for string representation
				if (value === null) return 'null';
				if (value === undefined) return 'undefined';
				if (typeof value === 'object') return JSON.stringify(value);
				return String(value);
			})
			.join('|');

		// If we haven't seen this combination before, add it to the result
		if (!seen.has(uniqueKey)) {
			seen.add(uniqueKey);
			result.push(item);
		}
	}

	return result;
}
