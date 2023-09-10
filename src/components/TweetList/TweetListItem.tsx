import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { InView } from 'react-intersection-observer';
import EmbedTweetComponent from '../EmbedTweetComponent';
import TweetContainer from '../TweetComponent/TweetContainer';
import TweetContainerCollapsed from '../TweetComponent/TweetContainerCollapsed';
import { COLOR_BORDER } from '../TweetComponent/consts';
import { t_dbAuthor, t_dbTweetDataParsed, t_onImageGallery } from '../TweetComponent/types';
import TouchableHighlight from '../utilCompos/TouchableHighlight';
import Rank from './Rank';
import Score from './Score';
import { t_activatedTweetData } from './TweetComponentList';

export type t_tweetViewStyleMode = 'CUSTOM' | 'EMBED' | 'NO_MEDIAS';

export default React.memo(TweetListItem, (prevProps, nextProps) => {
	console.log({
		readPrev: prevProps.isRead,
		readNext: nextProps.isRead,
		text: nextProps.tweetData.text,
	});
	return (
		prevProps.tweetViewStyleMode === nextProps.tweetViewStyleMode &&
		prevProps.isBlockedAccount === nextProps.isBlockedAccount &&
		prevProps.isRead === nextProps.isRead &&
		prevProps.isReexpanded === nextProps.isReexpanded
	);
});
function TweetListItem({
	tweetViewStyleMode,
	score,
	rank,
	authorData,
	tweetData,
	isBlockedAccount,
	isRead,
	isReexpanded,
	loadAuthorData,
	loadTweetData,
	onImageGallery,
	onOpenTwOption,
	onViewingTweet,
	onReexpand,
}: {
	tweetViewStyleMode: t_tweetViewStyleMode;
	score: number;
	rank: number;
	authorData: t_dbAuthor;
	tweetData: t_dbTweetDataParsed;
	isBlockedAccount: boolean;
	isRead: boolean;
	isReexpanded: boolean;
	loadAuthorData: (authorId: string) => t_dbAuthor;
	loadTweetData: (tweetId: string) => t_dbTweetDataParsed;
	onImageGallery: t_onImageGallery;
	onOpenTwOption: (data: t_activatedTweetData) => void;
	onViewingTweet: (tweetId: string) => any;
	onReexpand: (tweetId: string) => any;
}) {
	const call_onOpenTwOption = useCallback(
		() =>
			onOpenTwOption({
				tweetData: tweetData,
				authorData: authorData,
				isBlockedAccount: isBlockedAccount,
			}),
		[isBlockedAccount],
	);
	const collapseBgColor = useColorModeValue('#FFEDFC', '#222c38');

	const blockedOrRead = isBlockedAccount || isRead;

	const collapsed = blockedOrRead && !isReexpanded;
	return (
		<TouchableHighlight
			boxProps={{
				paddingTop: '8px',
				paddingBottom: '4px',
				paddingLeft: '16px',
				paddingRight: '16px',
				borderBottomColor: COLOR_BORDER,
				borderBottomWidth: 1,
				onClick: call_onOpenTwOption,
			}}
			baseBackgroundColor={blockedOrRead ? collapseBgColor : undefined}
		>
			<Flex direction={'row'} shrink={1} marginBottom={'4px'}>
				<Rank rank={rank + 1} />
				<Box marginLeft={'8px'}>
					<Score score={score} />
				</Box>
			</Flex>

			{collapsed ? (
				<TweetContainerCollapsed
					tweetData={tweetData}
					authorData={authorData}
					collapsedForWhat={isBlockedAccount ? 'BLOCKED' : 'READ'}
					onReexpand={onReexpand}
				/>
			) : tweetViewStyleMode === 'EMBED' ? (
				<EmbedTweetComponent tweetId={tweetData.tweet_id} />
			) : (
				<TweetContainer
					tweetData={tweetData}
					authorData={authorData}
					loadAuthorData={loadAuthorData}
					loadTweetData={loadTweetData}
					onImageGallery={onImageGallery}
					noMedias={tweetViewStyleMode === 'NO_MEDIAS' ? true : false}
				/>
			)}

			{/*ここまで画面に映したら既読トリガー*/}
			<InView
				onChange={(inView, entry) => {
					const twId = entry.target.getAttribute('data-twid');
					inView && twId && onViewingTweet(twId);
				}}
			>
				{({ inView, ref, entry }) => <div ref={ref} data-twid={tweetData.tweet_id}></div>}
			</InView>
		</TouchableHighlight>
	);
}
