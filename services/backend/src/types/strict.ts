type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export type StrictOmit<T, K extends keyof T> = Prettify<Omit<T, K>>;

export type StrictPick<T, K extends keyof T> = Prettify<Pick<T, K>>;

export type PartialPick<T, K extends keyof T> = Prettify<
	Partial<Pick<T, K>> & Omit<T, K>
>;

export type PartialOmit<T, K extends keyof T> = Prettify<
	Partial<Omit<T, K>> & Pick<T, K>
>;
