type Result<T, E = Error> = [T, null] | [null, E];

export function tryCatch<A extends readonly unknown[], T, E = Error>(
    fn: (...args: A) => Promise<T>,
): (...args: A) => Promise<Result<T, E>>;
export function tryCatch<A extends readonly unknown[], T, E = Error>(
    fn: (...args: A) => T,
): (...args: A) => Result<T, E>;
export function tryCatch<A extends readonly unknown[], T, E = Error>(
    fn: (...args: A) => T | Promise<T>,
): (...args: A) => Result<T, E> | Promise<Result<T, E>> {
    return (...args: A): Result<T, E> | Promise<Result<T, E>> => {
        try {
            const value = fn(...args);
            if (isPromiseLike<T>(value)) {
                return value.then(
                    (resolved): Result<T, E> => [resolved, null],
                    (error: unknown): Result<T, E> => [null, error as E],
                );
            }
            return [value, null];
        } catch (error) {
            return [null, error as E];
        }
    };
}

function isPromiseLike<T>(value: unknown): value is PromiseLike<T> {
    return (
        typeof value === 'object' &&
        value !== null &&
        typeof (value as PromiseLike<T>).then === 'function'
    );
}
