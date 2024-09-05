import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { InView } from 'react-intersection-observer';
import TouchableHighlight from '../../util-compos/TouchableHighlight';
import { COLOR_BORDER, SIZE_TEXT_XS } from '../inners/consts';
import Rank from './Rank';
import Score from './Score';

export type t_tweetViewStyleMode = 'CUSTOM' | 'EMBED' | 'NO_MEDIAS';

export default function TweetRankingItemsContainer(props: {
	children: React.ReactNode;
	rank: number;
	score: number;
	bgColor?: string;
	withReadMark: boolean;
	onContainer: () => void;
	onViewingTweet: () => any;
}) {
	//console.log('TweetRankingItemsContainer - ' + props.rank);
	return (
		<TouchableHighlight
			boxProps={{
				paddingTop: '8px',
				paddingBottom: '4px',
				paddingLeft: '16px',
				paddingRight: '16px',
				borderBottomColor: COLOR_BORDER,
				borderBottomWidth: 1,
				onClick: props.onContainer,
			}}
			baseBackgroundColor={props.bgColor}
		>
			<Flex direction={'row'} shrink={1} marginBottom={'4px'}>
				<Rank rank={props.rank + 1} />
				<Box marginLeft={'8px'}>
					<Score score={props.score} />
				</Box>
				{props.withReadMark && (
					<Flex flexDirection={'row-reverse'} flexGrow={1}>
						<FaCheck size={`${SIZE_TEXT_XS}px`} color={COLOR_BORDER} />
					</Flex>
				)}
			</Flex>

			{props.children}

			{/*ここまで画面に映したら既読トリガー*/}
			<InView
				onChange={(inView, entry) => {
					inView && props.onViewingTweet();
				}}
			>
				{({ inView, ref, entry }) => <div ref={ref}></div>}
			</InView>
		</TouchableHighlight>
	);
}
/*
React.memo(TweetListItem, (prevProps, nextProps) => {
	return (
		prevProps.tweetViewStyleMode === nextProps.tweetViewStyleMode &&
		prevProps.isBlockedAccount === nextProps.isBlockedAccount &&
		prevProps.isCollapseReadMode === nextProps.isCollapseReadMode &&
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
	isCollapseReadMode,
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
	isCollapseReadMode: boolean;
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
	const collapseBgColor = useColorModeValue('#FEEBC8', '#222c38');

	const blockedOrRead = isBlockedAccount || (isCollapseReadMode && isRead);

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
				{isRead && !collapsed && (
					<Flex flexDirection={'row-reverse'} flexGrow={1}>
						<FaCheck size={`${SIZE_TEXT_XS}px`} color={COLOR_BORDER} />
					</Flex>
				)}
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
*/
