export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export type StrictOmit<T, K extends keyof T> = Prettify<Omit<T, K>>;
export type StrictPick<T, K extends keyof T> = Prettify<Pick<T, K>>;
