import { t_dbAuthor, t_dbTweetDataParsed } from './types';

export default function TweetContainer(props: {
	authorData: t_dbAuthor;
	tweetData: t_dbTweetDataParsed;
	loadAuthorData: (authorId: string) => t_dbAuthor;
	loadTweetData: (tweetId: string) => t_dbTweetDataParsed;
}) {
	const repId = getRepliedId(props.tweetData);
	const qtId = getQtId(props.tweetData);
	return (
		<div style={{ margin: '10px' }}>
			{repId && (
				<RepliedContainer tweetId={repId} loadAuthorData={props.loadAuthorData} loadTweetData={props.loadTweetData} />
			)}
			<p>{props.authorData.screen_name}</p>
			<p>{props.tweetData.tweet_id}</p>
			<p>{props.tweetData.text}</p>
			{qtId && (
				<QuotedContainer tweetId={qtId} loadAuthorData={props.loadAuthorData} loadTweetData={props.loadTweetData} />
			)}
		</div>
	);
}

function QuotedContainer(props: {
	tweetId: string;
	loadAuthorData: (authorId: string) => t_dbAuthor;
	loadTweetData: (tweetId: string) => t_dbTweetDataParsed;
}) {
	const tweetData = props.loadTweetData(props.tweetId);
	if (tweetData.tweet_id === '0') {
		return null;
	}

	const authorData = props.loadAuthorData(tweetData.author_id);

	return (
		<div>
			<p>QT!</p>
			<p>{authorData.screen_name}</p>
			<p>{tweetData.tweet_id}</p>
			<p>{tweetData.text}</p>
		</div>
	);
}

/**
 * 
 * リプライ先データが無い事がある（長く続いてる会話など）
リプライ先データが無い場合はダミーデータは使わず普通に無いものとして扱う
 * @param props 
 * @returns 
 */
function RepliedContainer(props: {
	tweetId: string;
	loadAuthorData: (authorId: string) => t_dbAuthor;
	loadTweetData: (tweetId: string) => t_dbTweetDataParsed;
}) {
	const tweetData = props.loadTweetData(props.tweetId);
	if (tweetData.tweet_id === '0') {
		return null;
	}
	const authorData = props.loadAuthorData(tweetData.author_id);
	const qtId = getQtId(tweetData);

	return (
		<div>
			<p>Replied!</p>
			<p>{authorData.screen_name}</p>
			<p>{tweetData.tweet_id}</p>
			<p>{tweetData.text}</p>
			{qtId && (
				<QuotedContainer tweetId={qtId} loadAuthorData={props.loadAuthorData} loadTweetData={props.loadTweetData} />
			)}
		</div>
	);
}

function getRepliedId(tweetData: t_dbTweetDataParsed): string | undefined {
	return tweetData.others.replied_tweet_id;
}
function getQtId(tweetData: t_dbTweetDataParsed): string | undefined {
	return tweetData.others.quoted_tweet_id;
}
