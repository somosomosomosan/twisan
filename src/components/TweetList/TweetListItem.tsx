import React from 'react';
import TweetContainer from '../TweetComponent/TweetContainer';
import { t_dbAuthor, t_dbTweetDataParsed } from '../TweetComponent/types';

export default React.memo(
	TweetListItem,
	(prevProps, nextProps) => prevProps.isNgAccount === nextProps.isNgAccount && prevProps.isRead === nextProps.isRead,
);
function TweetListItem(props: {
	score: number;
	authorData: t_dbAuthor;
	tweetData: t_dbTweetDataParsed;
	isNgAccount: boolean;
	isRead: boolean;
	loadAuthorData: (authorId: string) => t_dbAuthor;
	loadTweetData: (tweetId: string) => t_dbTweetDataParsed;
}) {
	return (
		<TweetContainer
			tweetData={props.tweetData}
			authorData={props.authorData}
			loadAuthorData={props.loadAuthorData}
			loadTweetData={props.loadTweetData}
		/>
	);
}
