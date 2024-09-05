import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Eq';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { create } from 'zustand';
import { t_dbAuthor, t_dbTweetDataParsed } from '../tweet-components/inners/types';
import { t_tweetViewStyleMode } from '../tweet-components/outers/TweetRankingItemsContainer';
import { fptsExtractValues, uniqForShortArray } from '../util-funcs/array';
import { t_dataRanking, t_rankingHistory } from '../util-funcs/getRankingData';
import { t_reads } from './reads';
import buildRankingItemData from './tweet-rankings/buildRankingItemData';
import { t_blockedAccount, t_tweetListItemData } from './types';

type t_BearRankingHistories = {
	data: t_rankingHistory[];
	setData: (a: t_rankingHistory[]) => void;
	test: () => void;
	test2: (name: string) => void;
	//format: (rawdata: t_rankingHistoryRaw[]) => void;
};
export const useBearRankingHistories = create<t_BearRankingHistories>((set) => ({
	data: [],
	setData: (a) => set((state) => ({ data: a })),
	test: () =>
		set((state) => {
			return { data: state.data.map((e) => ({ ...e, file_name: e.file_name + 'yo' })) };
		}),
	test2: (name: string) =>
		set((state) => ({
			data: state.data.map((e) => (e.file_name === name ? { ...e, file_name: e.file_name + 'myoon' } : e)),
		})),
	/*
	format: (rawdata: t_rankingHistoryRaw[]) =>
		set((state) => ({
			data: rawdata.map((e: t_rankingHistoryRaw) => ({
				...e,
				created_at: new Date(e.created_at),
			})),
		})),*/
}));
type t_BearRankingItemData = {
	data: t_tweetListItemData[];
	tweets: t_dbTweetDataParsed[];
	authors: t_dbAuthor[];
	ngs: t_blockedAccount[];
	reads: t_reads[];
	setData: (rankings: t_dataRanking | undefined | null, ngs: t_blockedAccount[], reads: t_reads[]) => void;
	editByTweetId: (twId: string, call: (data: t_tweetListItemData) => t_tweetListItemData) => void;
	editByAuthorId: (authorId: string, call: (data: t_tweetListItemData) => t_tweetListItemData) => void;
	/**
	 * ng追加
	 * @param accountId
	 * @param saveFn ストレージ保存コールバック
	 * @returns
	 */
	addNg: (accountId: string, saveFn: (accounts: t_blockedAccount[]) => void) => void;
	removeNg: (accountId: string, saveFn: (accounts: t_blockedAccount[]) => void) => void;
	updateReads: (reads: t_reads[]) => void;
	getAuthor: (authorId: string) => O.Option<t_dbAuthor>;
	getTweet: (twId: string) => O.Option<t_dbTweetDataParsed>;
	//format: (rawdata: t_rankingHistoryRaw[]) => void;
};
export const useBearRankingItemData = create<t_BearRankingItemData>((set, get) => ({
	data: [],
	tweets: [],
	authors: [],
	ngs: [],
	reads: [],
	setData: (rankings: t_dataRanking | undefined | null, ngs: t_blockedAccount[], reads: t_reads[]) =>
		set((state) => ({
			data: rankings
				? buildRankingItemData({
						scores: rankings.scores,
						tweets: rankings.tweets,
						authors: rankings.authors,
						ngAccounts: ngs,
						readTweets: reads,
				  })
				: [],
			tweets: rankings ? rankings.tweets : [],
			authors: rankings ? rankings.authors : [],
			ngs: ngs,
			reads: reads,
		})),
	editByTweetId: (twId: string, call: (data: t_tweetListItemData) => t_tweetListItemData) =>
		set((state) => ({
			data: state.data.map((e) => (e.tweetData.tweet_id === twId ? call(e) : e)),
		})),
	editByAuthorId: (authorId: string, call: (data: t_tweetListItemData) => t_tweetListItemData) =>
		set((state) => ({
			data: state.data.map((e) => (e.tweetData.author_id === authorId ? call(e) : e)),
		})),
	addNg: (accountId: string, saveFn: (accounts: t_blockedAccount[]) => void) =>
		set((state) =>
			pipe(
				state.getAuthor(accountId),
				O.map((e) => [...state.ngs, { name: e.name, screen_name: e.screen_name, account_id: e.account_id }]),
				//重複除去
				O.map(A.uniq(E.fromEquals<t_blockedAccount>((x, y) => x.account_id === y.account_id))),
				O.map((ngs) => {
					saveFn(ngs);
					return { ngs: ngs };
				}),
				O.getOrElseW(() => state),
			),
		),
	removeNg: (accountId: string, saveFn: (accounts: t_blockedAccount[]) => void) => {
		set((state) => {
			const ngs = state.ngs.filter((e) => e.account_id !== accountId);
			saveFn(ngs);
			return { ngs: ngs };
		});
	},
	updateReads: (reads: t_reads[]) =>
		set((state) => {
			const readIds = pipe(fptsExtractValues(reads, 'tweet_ids'), A.flatten, uniqForShortArray);
			return {
				data: state.data.map((e) => ({ ...e, isRead: readIds.includes(e.tweetData.tweet_id) })),
				reads: reads,
			};
		}),
	getTweet: (twId: string) =>
		pipe(
			get().tweets,
			A.findFirst((e) => e.tweet_id === twId),
		),
	getAuthor: (authorId: string) =>
		pipe(
			get().authors,
			A.findFirst((e) => e.account_id === authorId),
		),
}));

type t_bearViewStyleMode = {
	mode: t_tweetViewStyleMode;
	setMode: (a: t_tweetViewStyleMode) => void;
};
export const useBearViewStyleMode = create<t_bearViewStyleMode>((set) => ({
	mode: 'CUSTOM',
	setMode: (a) => set((state) => ({ mode: a })),
}));

type t_bearToday = {
	date: Date;
	setDate: (a: Date) => void;
};
export const useBearToday = create<t_bearToday>((set) => ({
	date: new Date(),
	setDate: (a) => set((state) => ({ date: a })),
}));
