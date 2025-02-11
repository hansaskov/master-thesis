// Custom type to remove underscores and convert to lowercase
type RemoveUnderscoreAndLowercase<S extends string> =
	S extends `${infer F}_${infer R}`
		? `${Lowercase<F>}${RemoveUnderscoreAndLowercase<R>}`
		: Lowercase<S>;

// Modified TransformKeys type using the custom type
type TransformKeys<T> = T extends Array<unknown>
	? Array<TransformKeys<T[number]>>
	: T extends Record<string, unknown>
		? {
				[K in keyof T as RemoveUnderscoreAndLowercase<
					string & K
				>]: TransformKeys<T[K]>;
			}
		: T;

export function convertKeys<T>(obj: T): TransformKeys<T> {
	if (obj === null || typeof obj !== "object") {
		return obj as TransformKeys<T>;
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => convertKeys(item)) as TransformKeys<T>;
	}

	return Object.entries(obj as Record<string, unknown>).reduce(
		(acc: Partial<TransformKeys<T>>, [key, value]) => {
			const newKey = key
				.toLowerCase()
				.replace(/_/g, "") as keyof TransformKeys<T>;
			acc[newKey] = (
				typeof value === "object" ? convertKeys(value) : value
			) as TransformKeys<T>[keyof TransformKeys<T>];
			return acc;
		},
		{},
	) as TransformKeys<T>;
}
