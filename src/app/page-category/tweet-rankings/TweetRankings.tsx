import { Box, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { differenceInCalendarDays } from 'date-fns';
import { useCallback, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import Lightbox from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { t_categoryInfo } from '../../../types';
import { t_dbAuthor, t_dbTweetDataParsed, t_onImageGallery } from '../../tweet-components/inners/types';
import { uniqForShortArray } from '../../util-funcs/array';
import { addReadsToStorage, saveBlockedAccounts } from '../../util-funcs/localStorages';
import { useBearRankingItemData, useBearToday, useBearViewStyleMode } from '../bearHooks';
import { intoYyyy_mm_dd, parseYyyy_mm_dd, t_reads } from '../reads';
import { t_blockedAccount } from '../types';
import { TweetOptionModal } from './TweetOptionModal';
import { TweetRankingItemsContainerWrapper } from './TweetRankingItemsContainerWrapper';

type t_lightboxImage =
	| { type: 'image'; src: string }
	| { type: 'video'; poster?: string; sources: { src: string; type: 'video/mp4' }[] };
export type t_activatedTweetData = {
	authorData: t_dbAuthor;
	tweetData: t_dbTweetDataParsed;
	isBlockedAccount: boolean;
};

export default function TweetRankings(props: { categoryUrl: t_categoryInfo['url']; isCollapsingReads: boolean }) {
	const { ref_slides, state_lightboxOpen, state_slideInitIndex, setImagesAndOpenLightbox, closeLightbox } =
		useLightboxHooks();
	const { state_activatedTweetData, isOpenTwOption, onCloseTwOption, onOpenTwOption } = useTweetOptions();
	const rankingItemData = useBearRankingItemData((state) => state.data);
	const getTweet = useBearRankingItemData((state) => state.getTweet);
	const getAuthor = useBearRankingItemData((state) => state.getAuthor);
	const viewStyleMode = useBearViewStyleMode((state) => state.mode);
	const collapseBgColor = useColorModeValue('#FEEBC8', '#222c38');
	const { addTodayReads } = useTodaysReads(props.categoryUrl);
	const { onReexpand, onBlock, onUnblock } = useBlockAndReexpand(props.categoryUrl);

	const virtualListRef = useRef<HTMLDivElement>(null);
	const listVirtualizer = useWindowVirtualizer({
		count: rankingItemData.length,
		estimateSize: () => 700,
		overscan: 5,
		scrollMargin: virtualListRef.current?.offsetTop ?? 0,
	});
	const virtualListItems = listVirtualizer.getVirtualItems();

	const call_addTodayReads = useCallback(
		(tweetId: string) => {
			addTodayReads(tweetId);
		},
		[addTodayReads],
	);

	return (
		<Box ref={virtualListRef} width={'100%'} position={'relative'}>
			<Lightbox
				plugins={[Video, Zoom]}
				open={state_lightboxOpen}
				close={closeLightbox}
				index={state_slideInitIndex}
				slides={ref_slides.current}
				carousel={{ finite: true }}
				controller={{ closeOnBackdropClick: true, closeOnPullDown: true }}
			/>
			{state_activatedTweetData && (
				<TweetOptionModal
					isOpen={isOpenTwOption}
					onClose={onCloseTwOption}
					onBlock={onBlock}
					onUnblock={onUnblock}
					{...state_activatedTweetData}
				/>
			)}
			<Box height={listVirtualizer.getTotalSize()} width={'100%'} position={'relative'}>
				<Box
					position={'absolute'}
					top={0}
					left={0}
					width={'100%'}
					transform={`translateY(${(virtualListItems[0]?.start ?? 0) - listVirtualizer.options.scrollMargin}px)`}
				>
					{listVirtualizer.getVirtualItems().map((virtualRow) => {
						return (
							<div
								/* @ts-ignore */
								key={virtualRow.key}
								data-index={virtualRow.index}
								ref={listVirtualizer.measureElement}
								className={virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
							>
								<TweetRankingItemsContainerWrapper
									rank={virtualRow.index}
									data={rankingItemData[virtualRow.index]}
									collapseBgColor={collapseBgColor}
									viewStyleMode={viewStyleMode}
									isCollapsingReads={props.isCollapsingReads}
									loadAuthorData={getAuthor}
									loadTweetData={getTweet}
									onImageGallery={setImagesAndOpenLightbox}
									onOpenTwOption={onOpenTwOption}
									onViewingTweet={call_addTodayReads}
									onReexpand={onReexpand}
								/>
							</div>
						);
					})}
				</Box>
			</Box>
		</Box>
	);
}

function useBlockAndReexpand(categoryUrl: string) {
	//block解除時にその投稿者のツイートのreexpandプロパティをリセットする必要があるため、2つの処理を一つのカスタムフックにまとめる。
	const editStateByTweetId = useBearRankingItemData((state) => state.editByTweetId);
	const editStateByAuthorId = useBearRankingItemData((state) => state.editByAuthorId);
	const addNg = useBearRankingItemData((state) => state.addNg);
	const removeNg = useBearRankingItemData((state) => state.removeNg);
	//非表示を再展開
	const onReexpand = useCallback(
		(tweetId: string) => {
			editStateByTweetId(tweetId, (e) => ({ ...e, isReexpanded: true }));
		},
		[editStateByTweetId],
	);

	//NGアカウントを追加。localstorage更新。
	const onBlock = useCallback(
		(accountId: string) => {
			//指定アカウントの投稿をNG属性に。更にreexpandをリセット。これをしないと再展開したのをブロック解除→再ブロックしたときに展開されっぱなしになるため。
			editStateByAuthorId(accountId, (e) => ({ ...e, isNgAccount: true, isReexpanded: false }));
			//stateとstorageにngsを追加。
			addNg(accountId, (accounts: t_blockedAccount[]) => saveBlockedAccounts(categoryUrl, accounts));
		},
		[editStateByAuthorId, addNg, categoryUrl],
	);

	//NGアカウントを解除。localstorage更新。
	const onUnblock = useCallback(
		(accountId: string) => {
			editStateByAuthorId(accountId, (e) => ({ ...e, isNgAccount: false }));
			//stateとstorageにngsを追加。
			removeNg(accountId, (accounts: t_blockedAccount[]) => saveBlockedAccounts(categoryUrl, accounts));
		},
		[editStateByAuthorId, removeNg, categoryUrl],
	);
	return {
		onReexpand,
		onBlock,
		onUnblock,
	};
}

function useLightboxHooks() {
	//lightboxのslide用
	const ref_slides = useRef<t_lightboxImage[]>([]);
	//lightboxの開閉
	const [state_lightboxOpen, set_lightboxOpen] = useState<boolean>(false);
	//lightboxのslideで最初に開く画像index
	const [state_slideInitIndex, set_slideInitIndex] = useState<number>(0);
	//lightboxに画像をセットし開く
	const setImagesAndOpenLightbox: t_onImageGallery = useCallback((data, index) => {
		ref_slides.current = data.map((e) => {
			return e.type === 'image'
				? { type: 'image', src: e.src }
				: { type: 'video', poster: e.video_poster_url, sources: [{ src: e.src, type: 'video/mp4' }] };
		});
		set_slideInitIndex(index);
		set_lightboxOpen(true);
	}, []);
	const closeLightbox = useCallback(() => set_lightboxOpen(false), []);

	return {
		ref_slides,
		state_lightboxOpen,
		state_slideInitIndex,
		setImagesAndOpenLightbox,
		closeLightbox,
	};
}

function useTweetOptions() {
	//ツイートオプションモーダルに渡すツイートデータ
	const [state_activatedTweetData, set_activatedTweetData] = useState<t_activatedTweetData>();
	//モーダル関連
	const { isOpen: isOpenTwOption, onOpen, onClose: onCloseTwOption } = useDisclosure();
	//ツイートオプションを開く
	const onOpenTwOption = useCallback((data: t_activatedTweetData) => {
		set_activatedTweetData(data);
		onOpen();
	}, []);

	return {
		state_activatedTweetData,
		isOpenTwOption,
		onCloseTwOption,
		onOpenTwOption,
	};
}

function useTodaysReads(categoryUrl: string) {
	const reads = useBearRankingItemData((state) => state.reads);
	const today = useBearToday((state) => state.date);
	//今日のreads
	const ref_todaysReads = useRef<t_reads>(
		reads.find((e) => {
			const d = parseYyyy_mm_dd(e.yyyy_mm_dd);
			return differenceInCalendarDays(today, d) === 0;
		}) ?? { yyyy_mm_dd: intoYyyy_mm_dd(today), tweet_ids: [] },
	);

	//渡された既読を保存。debounceで。
	const saveTodaysReadsDebounce = useDebouncedCallback(
		// function
		(reads: t_reads) => {
			addReadsToStorage(categoryUrl, {
				...reads,
				tweet_ids: uniqForShortArray(reads.tweet_ids),
			});
		},
		// delay in ms
		1000,
	);
	//今日の既読を追加。そして保存。
	const addTodayReads = useCallback((tweetId: string) => {
		//とりあえず追加していく。高速で何度も呼ばれることがあるので重たい処理（重複除去）は保存時にだけやる。
		ref_todaysReads.current = {
			...ref_todaysReads.current,
			tweet_ids: [...ref_todaysReads.current.tweet_ids, tweetId],
		};
		//保存
		saveTodaysReadsDebounce(ref_todaysReads.current);
	}, []);
	return {
		addTodayReads,
	};
}
