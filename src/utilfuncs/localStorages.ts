import { t_tweetViewStyleMode } from '../components/tweetListComponents/TweetListItem';
import { t_blockedAccount } from '../components/tweetListComponents/types';
import { fromNullable } from './monads';
import { t_reads } from './reads';

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
function loadDataFromStorage(key: string) {
	return localStorage.getItem(key);
}
function saveDataToStorage(key: string, value: string) {
	return localStorage.setItem(key, value);
}
function removeDataFromStorage(key: string) {
	return localStorage.removeItem(key);
}
function loadJsonDataFromStorage<T>(key: string): T {
	return fromNullable(loadDataFromStorage(key), '').map(JSON.parse).unwrapOr([]);
}

export function loadReadsFromStorage(categoryName: string): t_reads[] {
	return loadJsonDataFromStorage<t_reads[]>(PREFIX_READS + categoryName);
}
export function saveReadsToStorage(categoryName: string, reads: t_reads[]) {
	return saveDataToStorage(PREFIX_READS + categoryName, JSON.stringify(reads));
}
export function addReadsToStorage(categoryName: string, reads: t_reads) {
	const storagedReads = loadReadsFromStorage(categoryName);
	return saveReadsToStorage(categoryName, [...storagedReads.filter((e) => e.yyyy_mm_dd !== reads.yyyy_mm_dd), reads]);
}

export function loadBlockedAccountsFromStorage(categoryName: string): t_blockedAccount[] {
	return loadJsonDataFromStorage<t_blockedAccount[]>(PREFIX_BLOCKED_ACCOUNTS + categoryName);
}
export function saveBlockedAccounts(categoryName: string, accounts: t_blockedAccount[]) {
	return saveDataToStorage(PREFIX_BLOCKED_ACCOUNTS + categoryName, JSON.stringify(accounts));
}

export function loadTweetViewStyleMode(): t_tweetViewStyleMode {
	const r = loadDataFromStorage(PREFIX_TWEET_VIEW_STYLE_MODE);
	return r === 'EMBED' || r === 'CUSTOM' || r === 'NO_MEDIAS' ? r : 'CUSTOM';
}

export function saveTweetViewStyleMode(mode: t_tweetViewStyleMode) {
	return saveDataToStorage(PREFIX_TWEET_VIEW_STYLE_MODE, mode);
}
