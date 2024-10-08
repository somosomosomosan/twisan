import { t_dbAuthor, t_dbTweetDataParsed } from './types';

export const SPACE_BASE = 8;
export const SPACE_BASE_M = 12;

//name, pollのテキストなど
export const COLOR_LIGHTBLACK = 'rgb(15, 20, 25)';
//screen_name, 投稿時間, publicMetrics等
export const COLOR_SUBTEXT = 'rgb(83, 100, 113)';
export const COLOR_SUBTEXT_IN_DARKMODE = 'rgb(146, 166, 180)';
//ハッシュタグやURLとか。verifiedマークもこれ
export const COLOR_LINK = 'rgb(29, 155, 240)';

export const COLOR_BORDER = 'rgb(207, 217, 222)';

export const COLOR_BG_IN_DARKMODE = '#1A202C';

export const SIZE_TEXT_XS = 14;
//name, screen_name, 投稿時間, publicMetrics, 参照先ツイートの本文等
export const SIZE_TEXT_S = 15;
//本文など
export const SIZE_TEXT_M = 17;

export const DUMMY_AUTHOR: t_dbAuthor = {
	account_id: '0',
	name: '?',
	profile_image_url: '',
	screen_name: '?',
};
export const DUMMY_TWEET: t_dbTweetDataParsed = {
	tweet_id: '0',
	author_id: '0',
	text: 'この投稿のデータを取得できませんでした。',
	created_at: '0',
	retweets: 0,
	likes: 0,
	quotes: 0,
	replies: 0,
	others: {},
};
