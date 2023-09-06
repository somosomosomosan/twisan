import React, { useCallback } from 'react';
import { InView } from 'react-intersection-observer';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import EmbedTweetComponent from '../EmbedTweetComponent';
import TweetContainer from '../TweetComponent/TweetContainer';
import TweetContainerCollapsed from '../TweetComponent/TweetContainerCollapsed';
import { COLOR_BORDER, SPACE_BASE } from '../TweetComponent/consts';
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
	const blockedOrRead = isBlockedAccount || isRead;

	const collapsed = blockedOrRead && !isReexpanded;
	return (
		<TouchableHighlight
			boxProps={{
				css: styles.container,
				onClick: call_onOpenTwOption,
			}}
			baseBackgroundColor={blockedOrRead ? '#FFEDFC' : undefined}
		>
			<div css={styles.rankScoreContainer}>
				<Rank rank={rank + 1} />
				<div css={styles.scoreContainer}>
					<Score score={score} />
				</div>
			</div>

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

const styles = {
	container: css({
		paddingTop: SPACE_BASE,
		paddingBottom: 4,
		paddingLeft: SPACE_BASE * 2,
		paddingRight: SPACE_BASE * 2,
		borderBottomColor: COLOR_BORDER,
		borderBottomWidth: 1,
	}),
	containerNgOrRead: css({
		backgroundColor: '#FFEDFC',
	}),
	topContainer: css({
		paddingLeft: SPACE_BASE * 2,
		paddingRight: SPACE_BASE * 2,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	}),
	rankScoreContainer: css({
		display: 'flex',
		flexDirection: 'row',
		flexShrink: 1,
		marginBottom: 4,
	}),
	scoreContainer: {
		marginLeft: SPACE_BASE,
	},
};
