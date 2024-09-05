import { Box } from '@chakra-ui/react';
import * as O from 'fp-ts/Option';
import React, { useCallback } from 'react';
import EmbedTweetComponent from '../../embed-tweet/EmbedTweet';
import TweetDataContainer from '../../tweet-components/inners/TweetDataContainer';
import TweetDataContainerCollapsed from '../../tweet-components/inners/TweetDataContainerCollapsed';
import { t_dbAuthor, t_dbTweetDataParsed, t_onImageGallery } from '../../tweet-components/inners/types';
import TweetRankingItemsContainer, {
	t_tweetViewStyleMode,
} from '../../tweet-components/outers/TweetRankingItemsContainer';
import { t_tweetListItemData } from '../types';
import { t_activatedTweetData } from './TweetRankings';

//このコンポーネントとTweetListItemは異なるディレクトリに配置すべきである。このコンポーネントはviewStyleMode、つまりglobal stateとの依存関係がある。一方でTweetListItemはカプセル化されている。
export const TweetRankingItemsContainerWrapper = React.memo(Comp, (prevProps, nextProps) => {
	return (
		prevProps.data.isNgAccount === nextProps.data.isNgAccount &&
		prevProps.data.isRead === nextProps.data.isRead &&
		prevProps.data.isReexpanded === nextProps.data.isReexpanded &&
		prevProps.viewStyleMode === nextProps.viewStyleMode &&
		prevProps.collapseBgColor === nextProps.collapseBgColor &&
		prevProps.isCollapsingReads === nextProps.isCollapsingReads
	);
});
function Comp(props: {
	rank: number;
	data: t_tweetListItemData;
	viewStyleMode: t_tweetViewStyleMode;
	collapseBgColor: string;
	isCollapsingReads: boolean;
	loadAuthorData: (authorId: string) => O.Option<t_dbAuthor>;
	loadTweetData: (tweetId: string) => O.Option<t_dbTweetDataParsed>;
	onImageGallery: t_onImageGallery;
	onReexpand: (tweetId: string) => any;
	onOpenTwOption: (data: t_activatedTweetData) => void;
	onViewingTweet: (tweetId: string) => any;
}) {
	const {
		rank,
		data,
		viewStyleMode,
		collapseBgColor,
		isCollapsingReads,
		loadAuthorData,
		loadTweetData,
		onImageGallery,
		onReexpand,
		onOpenTwOption,
		onViewingTweet,
	} = props;

	const blockedOrRead = data.isNgAccount || (isCollapsingReads && data.isRead);
	const collapsed = blockedOrRead && !data.isReexpanded;
	const isNgAccount = data.isNgAccount; //useCallbackのために一旦変数に

	const call_onOpenTwOption = useCallback(
		() =>
			onOpenTwOption({
				tweetData: data.tweetData,
				authorData: data.authorData,
				isBlockedAccount: isNgAccount,
			}),
		[isNgAccount],
	);
	const call_onViewingTweet = useCallback(() => onViewingTweet(data.tweetData.tweet_id), []);

	return (
		<Box>
			<TweetRankingItemsContainer
				rank={rank}
				score={data.score}
				bgColor={blockedOrRead ? collapseBgColor : undefined}
				withReadMark={data.isRead ? true : false}
				onContainer={call_onOpenTwOption}
				onViewingTweet={call_onViewingTweet}
			>
				{collapsed ? (
					<TweetDataContainerCollapsed
						tweetData={data.tweetData}
						authorData={data.authorData}
						collapsedForWhat={data.isNgAccount ? 'BLOCKED' : 'READ'}
						onReexpand={onReexpand}
					/>
				) : viewStyleMode === 'EMBED' ? (
					<EmbedTweetComponent tweetId={data.tweetData.tweet_id} />
				) : (
					<TweetDataContainer
						tweetData={data.tweetData}
						authorData={data.authorData}
						loadAuthorData={loadAuthorData}
						loadTweetData={loadTweetData}
						onImageGallery={onImageGallery}
						noMedias={viewStyleMode === 'NO_MEDIAS' ? true : false}
					/>
				)}
			</TweetRankingItemsContainer>
		</Box>
	);
}
