export type t_dbTweetData = {
	//ツイートのID
	tweet_id: string;
	//投稿者のアカウントID
	author_id: string;
	text: string;
	created_at: number;
	//RT数
	retweets: number;
	likes: number;
	quotes: number;
	replies: number;
	others: string; //t_dbTweetDataOthersObjのjson
};
export type t_dbTweetDataParsed = Omit<t_dbTweetData, 'others'> & {
	others: t_dbTweetDataOthersObj; //t_dbTweetDataOthersObjのjson
};
export type t_dbTweetDataOthersObj = {
	replied_tweet_id?: string;
	quoted_tweet_id?: string;
	urls?: t_urls[];
	cardLink?: t_cardLink;
	mentions?: t_mentions[];
	medias?: (t_mediaPhoto | t_mediaVideo)[];
	polls?: t_poll[];
};
export type t_mentions = {
	id: string;
	screen_name: string;
};

export type t_urls = {
	display_url: string;
	expanded_url: string;
	url: string;
};
export type t_cardLink = {
	url: string;
	photo_url: string;
	photo_height: number;
	photo_width: number;
	title: string;
	description: string;
};
export type t_mediaPhoto = {
	type: 'photo';
	url: string;
	height: number;
	width: number;
};
export type t_mediaVideo = {
	type: 'video' | 'animated_gif';
	photo_url: string;
	video_url: string;
	photo_height: number;
	photo_width: number;
};

export type t_poll = {
	label: string;
	votes: number;
};

export type t_dbAuthor = {
	//twitterにおけるアカウントID
	account_id: string;
	//名前
	name: string;
	//アバターURL
	profile_image_url: string;
	//スクリーンネーム
	screen_name: string;
	//SQLiteにはbooleanは格納できないので数値化する必要がある
	verified: boolean;
};

export type t_dbTweetScores = {
	attempt_id: number;
	tweet_id: t_dbTweetData['tweet_id'];
	//アプリが付けたスコア
	score: number;
};
