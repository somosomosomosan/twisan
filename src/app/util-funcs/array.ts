import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Lens } from 'monocle-ts';
/**
 * 巨大でない配列で安定して速度が速い重複除去
 * @param array
 * @returns
 */
export const uniqForShortArray = <T>(array: T[]): T[] => {
	const uniquedArray: T[] = [];
	for (const elem of array) {
		if (!uniquedArray.includes(elem)) uniquedArray.push(elem);
	}
	return uniquedArray;
};
/**
 * filterでundefinedを取り除きつつtypescriptの型判断も正確にさせるコールバック。
 * filterのコールバックとして使う。
 * @param item
 * @returns
 */
export const filterCallRemoveUndefineds = <T>(item: T): item is Exclude<typeof item, undefined> => item !== undefined;
/**
 * 全ての要素がOption型を返す関数である配列を走査し、最初にSome型を返した関数の返り値を返す。
 * 1つもSome型を返さなかった場合にはNone型を返す。
 * @param calls
 * @returns
 */
export function fptsFindFirstSomeCallback<T>(calls: (() => O.Option<T>)[]): O.Option<T> {
	for (const iterator of calls) {
		const r = iterator();
		if (O.isSome(r)) {
			return r;
		}
	}
	return O.none;
}
/**
 * オブジェクト配列から指定キーの値を抽出して返す。
 * @param arr
 * @param key
 * @returns
 */
export function fptsExtractValues<T, K extends keyof T>(arr: T[], key: K): T[K][] {
	return pipe(
		arr,
		A.map((obj) => Lens.fromProp<T>()(key).get(obj)),
	);
}
