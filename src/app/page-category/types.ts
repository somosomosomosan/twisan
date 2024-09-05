import { t_dbAuthor, t_dbTweetDataParsed } from '../tweet-components/inners/types';

export type t_blockedAccount = {
	account_id: string;
	screen_name: string;
	name: string;
};

export type t_tweetListItemData = {
	score: number;
	tweetData: t_dbTweetDataParsed;
	authorData: t_dbAuthor;
	isNgAccount: boolean;
	isRead: boolean;
	isReexpanded: boolean;
};

/*
export type t_tweetListItemData = {
	score: number;
	tweetData: t_dbTweetDataParsed;
	authorData: t_dbAuthor;
	isNgAccount: boolean;
	isRead: boolean;
	isReexpanded: boolean;
};

*/
