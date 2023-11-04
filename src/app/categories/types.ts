import { t_dbAuthor, t_dbTweetDataParsed, t_dbTweetScores } from '../../components/tweetComponents/types';
import { t_tweetViewStyleMode } from '../../components/tweetListComponents/TweetListItem';
import { t_blockedAccount } from '../../components/tweetListComponents/types';
import { t_reads } from '../../utilfuncs/reads';

export type t_categoryInfo = {
	name: string;
	url: string;
};

export type t_storagedData = {
	tweetViewStyleMode: t_tweetViewStyleMode;
	chunkedScores: t_dbTweetScores[][];
	tweets: t_dbTweetDataParsed[];
	authors: t_dbAuthor[];
	blockedAccounts: t_blockedAccount[];
	readTweets: t_reads[];
};
