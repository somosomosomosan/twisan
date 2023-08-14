import * as Rb from 'rambda';
import * as Re from 'remeda';
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
type NestedArray<T> = Array<NestedArray<T> | T>;
/**
 * 配列をflat、重複除去。
 * @param arr
 * @returns
 */
export const flattenUniq = <T>(arr: NestedArray<T>): T[] =>
	Re.pipe(
		arr,
		//flat化
		Rb.flatten as (a: NestedArray<T>) => T[], //typesciprtをわからせるために
		//重複除去
		uniqForShortArray,
	);
