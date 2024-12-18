// Custom type to remove underscores and convert to lowercase
type RemoveUnderscoreAndLowercase<S extends string> = 
    S extends `${infer F}_${infer R}`
        ? `${Lowercase<F>}${RemoveUnderscoreAndLowercase<R>}`
        : Lowercase<S>;

// Modified TransformKeys type using the custom type
type TransformKeys<T> = T extends Array<any>
    ? Array<TransformKeys<T[number]>>
    : T extends object
    ? { [K in keyof T as RemoveUnderscoreAndLowercase<string & K>]: TransformKeys<T[K]> }
    : T;

export function convertKeys<T extends Record<string, any>>(
    obj: T
): TransformKeys<T> {
    if (obj === null || typeof obj !== 'object') {
        return obj as TransformKeys<T>;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => convertKeys(item)) as TransformKeys<T>;
    }

    return Object.entries(obj).reduce((acc: any, [key, value]) => {
        const newKey = key.toLowerCase().replace(/_/g, '');
        acc[newKey] = typeof value === 'object' 
            ? convertKeys(value)
            : value;
        return acc;
    }, {}) as TransformKeys<T>;
}