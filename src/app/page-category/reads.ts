import { differenceInCalendarDays, format } from 'date-fns';
import { READS_SAVE_DAYS } from '../../consts';
import { loadReadsFromStorage, saveReadsToStorage } from '../util-funcs/localStorages';

export type t_reads = {
	yyyy_mm_dd: string; // 1月は01 (javascriptのDateだと1月は00)
	tweet_ids: string[];
};
export function setupReads(categoryUrl: string, today: Date) {
	const savedReads = loadReadsFromStorage(categoryUrl);
	//今日からREADS_SAVE_DAYSより前のreads履歴は削除する。
	const savedReadsRemovedTooOlds = removeReadsNDaysBeforeThenSave(savedReads, today, READS_SAVE_DAYS);
	saveReadsToStorage(categoryUrl, savedReadsRemovedTooOlds);
	return savedReadsRemovedTooOlds;
}
/**
 * readsからn日より前のデータを除去し、それを返す。
 */
function removeReadsNDaysBeforeThenSave(reads: t_reads[], startD: Date, nDaysBefore: number): t_reads[] {
	const r = reads.filter((e) => {
		const d = parseYyyy_mm_dd(e.yyyy_mm_dd);
		return differenceInCalendarDays(startD, d) > nDaysBefore ? false : true;
	});
	return r;
}

export function parseYyyy_mm_dd(yyyy_mm_dd: string): Date {
	const a = yyyy_mm_dd.split('_').map(Number);
	//(年,月,日) 1月=00
	return new Date(a[0], a[1] - 1, a[2]);
}

export function intoYyyy_mm_dd(d: Date): string {
	return format(d, 'yyyy_MM_dd');
}
