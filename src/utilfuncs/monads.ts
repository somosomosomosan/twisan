import { Result, err, ok } from 'neverthrow';
/**
 * aがnullまたはundefinedならerr(error)を返す。そうでなければok(a)を返す。
 * @param a
 * @param error
 * @returns
 */
export function fromNullable<T, U>(a: T, error: U): Result<NonNullable<T>, U> {
	if (a === null || a === undefined) {
		return err(error);
	}
	return ok(a);
}
