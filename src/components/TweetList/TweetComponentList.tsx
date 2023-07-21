import { useCallback } from 'react';
import { t_dbAuthor, t_dbTweetDataParsed, t_dbTweetScores } from '../TweetComponent/types';
import { t_ngAccount } from './types';
import TweetListItem from './TweetListItem';

export default function TweetComponentList(props: {
	scores: t_dbTweetScores[];
	tweets: t_dbTweetDataParsed[];
	authors: t_dbAuthor[];
	ngAccounts: t_ngAccount[];
	readTweets: string[];
}) {
	const _getAuthorData = useCallback((authorId: string) => getAuthorData(props.authors, authorId), [props.authors]);
	const _getTweetData = useCallback((tweetId: string) => getTweetData(props.tweets, tweetId), [props.tweets]);

	return (
		<div>
			{props.scores.map((e, i) => {
				//NG・既読はここで予め判定しておく。ListItemの方でそれらを参照させる方式だと、どこかのそれに変更があったら全てのListItemが再描画されるようになってしまう。
				const data = buildRankedTweetData(e, props.authors, props.tweets, props.ngAccounts, props.readTweets);
				return (
					<TweetListItem
						key={i}
						score={data.score}
						authorData={data.authorData}
						tweetData={data.tweetData}
						loadAuthorData={_getAuthorData}
						loadTweetData={_getTweetData}
						isNgAccount={data.isNgAccount}
						isRead={data.isRead}
					/>
				);
			})}
		</div>
	);
}

function buildRankedTweetData(
	score: t_dbTweetScores,
	authors: t_dbAuthor[],
	tweets: t_dbTweetDataParsed[],
	ngAccounts: t_ngAccount[],
	readTweets: string[],
) {
	const tweetData = getTweetData(tweets, score.tweet_id);
	return {
		score: score.score,
		authorData: getAuthorData(authors, tweetData.author_id),
		tweetData: tweetData,
		isNgAccount: isNgAccount(ngAccounts, tweetData.author_id),
		isRead: readTweets.includes(tweetData.tweet_id),
	};
}

const DUMMY_AUTHOR: t_dbAuthor = {
	account_id: '0',
	name: '?',
	profile_image_url: '',
	screen_name: '?',
	verified: false,
};
const DUMMY_TWEET: t_dbTweetDataParsed = {
	tweet_id: '0',
	author_id: '0',
	text: '?',
	created_at: 0,
	retweets: 0,
	likes: 0,
	quotes: 0,
	replies: 0,
	others: {},
};
function getAuthorData(authors: t_dbAuthor[], authorId: string): t_dbAuthor {
	return authors.find((e) => e.account_id === authorId) ?? DUMMY_AUTHOR;
}
function getTweetData(tweetData: t_dbTweetDataParsed[], tweetId: string): t_dbTweetDataParsed {
	return tweetData.find((e) => e.tweet_id === tweetId) ?? DUMMY_TWEET;
}
function isNgAccount(ngAccounts: t_ngAccount[], authorId: string): boolean {
	return ngAccounts.find((e) => e.account_id === authorId) ? true : false;
}
