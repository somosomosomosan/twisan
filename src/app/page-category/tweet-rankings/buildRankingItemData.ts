import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { t_dbAuthor, t_dbTweetDataParsed, t_dbTweetScores } from '../../tweet-components/inners/types';
import { filterCallRemoveUndefineds, fptsExtractValues, uniqForShortArray } from '../../util-funcs/array';
import { t_reads } from '../reads';
import { t_blockedAccount, t_tweetListItemData } from '../types';

type t_args = {
	scores: t_dbTweetScores[];
	tweets: t_dbTweetDataParsed[];
	authors: t_dbAuthor[];
	ngAccounts: t_blockedAccount[];
	readTweets: t_reads[];
};
export default function buildRankingItemData(args: t_args): t_tweetListItemData[] {
	const readIds = pipe(fptsExtractValues(args.readTweets, 'tweet_ids'), A.flatten, uniqForShortArray);
	//tweet/authorのデータの取得に失敗した場合はそのツイートはランキングから除去
	return args.scores
		.map((s) =>
			pipe(
				args.tweets,
				A.findFirst((t) => t.tweet_id === s.tweet_id),
				O.chain((tweetData) =>
					pipe(
						args.authors,
						A.findFirst((a) => a.account_id === tweetData.author_id),
						O.map((a) => ({
							score: s.score,
							tweetData: tweetData,
							authorData: a,
							isNgAccount: isNgAccount(args.ngAccounts, tweetData.author_id),
							isRead: readIds.includes(tweetData.tweet_id),
							isReexpanded: false,
						})),
					),
				),
				O.getOrElseW(() => undefined),
			),
		)
		.filter(filterCallRemoveUndefineds);
}

const isNgAccount = (ngAccounts: t_blockedAccount[], authorId: string): boolean => {
	return ngAccounts.find((e) => e.account_id === authorId) ? true : false;
};
