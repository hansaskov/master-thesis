/**
 * A utility type to improve readability of complex types by removing excess type information
 * @template T The type to prettify
 */
type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

/**
 * A type-safe version of Omit that allows omitting either a single key or multiple keys from a type.
 * @example
 *
 * // Omit a single key
 * type UserWithoutId = StrictOmit<User, "id">;
 * // Equivalent to: { name: string; email: string; age: number; }
 *
 * // Omit multiple keys
 * type ReducedUser = StrictOmit<User, ["id", "age"]>;
 * // Equivalent to: { name: string; email: string; }
 */
export type StrictOmit<T, K extends keyof T> = Prettify<Omit<T, K>>;

export type StrictPick<T, K extends keyof T> = Prettify<Pick<T, K>>;

export type StrictPartial<T, K extends keyof T> = Prettify<
	Partial<Pick<T, K>> & Omit<T, K>
>;
