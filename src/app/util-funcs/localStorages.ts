import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { t_reads } from '../page-category/reads';
import { t_blockedAccount } from '../page-category/types';
import { t_tweetViewStyleMode } from '../tweet-components/outers/TweetRankingItemsContainer';

/************
 * localStorageに保存するデータ
 * 各カテゴリのNGアカウント
 * 各カテゴリの既読
 * デザインモード
 *
 *************/
const PREFIX_READS = 'reads-';
const PREFIX_BLOCKED_ACCOUNTS = 'blocked_Accounts-';
const PREFIX_TWEET_VIEW_STYLE_MODE = 'tweet_view_style_mode';

function loadJsonDataFromLocalStorage<T>(key: string): T {
	return pipe(
		O.fromNullable(localStorage.getItem(key)),
		O.map(JSON.parse),
		O.getOrElse(() => [] as T),
	);
}

export function loadReadsFromStorage(categoryUrl: string): t_reads[] {
	return loadJsonDataFromLocalStorage<t_reads[]>(PREFIX_READS + categoryUrl);
}
export function saveReadsToStorage(categoryUrl: string, reads: t_reads[]) {
	return localStorage.setItem(PREFIX_READS + categoryUrl, JSON.stringify(reads));
}
export function addReadsToStorage(categoryUrl: string, reads: t_reads) {
	const storagedReads = loadReadsFromStorage(categoryUrl);
	return saveReadsToStorage(categoryUrl, [...storagedReads.filter((e) => e.yyyy_mm_dd !== reads.yyyy_mm_dd), reads]);
}

export function loadBlockedAccountsFromStorage(categoryUrl: string): t_blockedAccount[] {
	return loadJsonDataFromLocalStorage<t_blockedAccount[]>(PREFIX_BLOCKED_ACCOUNTS + categoryUrl);
}
export function saveBlockedAccounts(categoryUrl: string, accounts: t_blockedAccount[]) {
	return localStorage.setItem(PREFIX_BLOCKED_ACCOUNTS + categoryUrl, JSON.stringify(accounts));
}

export function loadTweetViewStyleMode(): t_tweetViewStyleMode {
	const r = localStorage.getItem(PREFIX_TWEET_VIEW_STYLE_MODE);
	return r === 'EMBED' || r === 'CUSTOM' || r === 'NO_MEDIAS' ? r : 'CUSTOM';
}

export function saveTweetViewStyleMode(mode: t_tweetViewStyleMode) {
	return localStorage.setItem(PREFIX_TWEET_VIEW_STYLE_MODE, mode);
}
