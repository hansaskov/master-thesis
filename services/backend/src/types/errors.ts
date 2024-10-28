export function catchError<T, E extends new (message: string) => Error, Errors extends E[] = E[]>(
	promise: Promise<T>,
	errorToCatch?: [...Errors],
): Promise<[undefined, T] | [InstanceType<Errors[number]>]> {
	return promise
		.then((data) => {
			return [undefined, data] as [undefined, T];
		})
		.catch((error) => {
			if (errorToCatch === undefined) {
				return [error];
			}
			if (errorToCatch.some((e) => error instanceof e)) {
				return [error] as [InstanceType<Errors[number]>];
			}
			throw error;
		});
}
