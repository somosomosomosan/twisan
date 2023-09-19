import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { differenceInCalendarDays } from 'date-fns';
import * as Rb from 'rambda';
import { useCallback, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import * as Re from 'remeda';
import { useDebouncedCallback } from 'use-debounce';
import Lightbox from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { t_storagedData } from '../../app/categories/smash/page';
import { flattenUniq, uniqForShortArray } from '../../utilfuncs/array';
import { addReadsToStorage, saveBlockedAccounts } from '../../utilfuncs/localStorages';
import { intoYyyy_mm_dd, parseYyyy_mm_dd, t_reads } from '../../utilfuncs/reads';
import {
	t_dbAuthor,
	t_dbTweetDataParsed,
	t_dbTweetScores,
	t_mediaPhoto,
	t_mediaVideo,
	t_onImageGallery,
	t_urls,
} from '../TweetComponent/types';
import TweetListItem from './TweetListItem';
import { TweetOptionModal } from './TweetOptionModal';
import { t_blockedAccount } from './types';

type t_lightboxImage =
	| { type: 'image'; src: string }
	| { type: 'video'; poster?: string; sources: { src: string; type: 'video/mp4' }[] };
export type t_activatedTweetData = {
	authorData: t_dbAuthor;
	tweetData: t_dbTweetDataParsed;
	isBlockedAccount: boolean;
};

export default function TweetComponentList(
	props: t_storagedData & { categoryName: string; today: Date; collapseRead: boolean },
) {
	const { state_listScores, state_hasMoreListScores, onLoadNextPage } = useListHooks(props.chunkedScores);
	const { ref_slides, state_lightboxOpen, state_slideInitIndex, setImagesAndOpenLightbox, closeLightbox } =
		useLightboxHooks();
	const { state_activatedTweetData, isOpenTwOption, onCloseTwOption, onOpenTwOption } = useTweetOptions();
	const { getAuthorData, getTweetData, getReadTweetIds } = useGetTweetData(
		props.tweets,
		props.authors,
		props.readTweets,
	);
	const { state_reexpandedTweets, state_blockedAccounts, onReexpand, onBlock, onUnblock } = useBlockTweet(
		props.categoryName,
		props.tweets,
		props.authors,
		props.blockedAccounts,
		getAuthorData,
	);
	const { addTodayReads } = useTodaysReads(props.categoryName, props.readTweets, props.today);
	return (
		<Box>
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
			<InfiniteScroll
				loadMore={onLoadNextPage} //項目を読み込む際に処理するコールバック関数
				hasMore={state_hasMoreListScores} //読み込みを行うかどうかの判定
				loader={<LoadingComponent key={'loader'} onLoad={onLoadNextPage} />} //読み込み最中に表示する項目
				initialLoad={false}
				threshold={500}
			>
				{state_listScores.map((e, i) => {
					//NG・既読はここで予め判定しておく。ListItemの方でそれらを参照させる方式だと、どこかのそれに変更があったら全てのListItemが再描画されるようになってしまう。
					const data = buildRankedTweetData(
						e,
						getTweetData,
						getAuthorData,
						state_blockedAccounts,
						getReadTweetIds(),
						state_reexpandedTweets,
					);
					return (
						<TweetListItem
							tweetViewStyleMode={props.tweetViewStyleMode}
							key={i}
							score={data.score}
							rank={i}
							authorData={data.authorData}
							tweetData={data.tweetData}
							loadAuthorData={getAuthorData}
							loadTweetData={getTweetData}
							isBlockedAccount={data.isNgAccount}
							isCollapseReadMode={props.collapseRead}
							isRead={data.isRead}
							isReexpanded={data.isReexpanded}
							onImageGallery={setImagesAndOpenLightbox}
							onOpenTwOption={onOpenTwOption}
							onViewingTweet={addTodayReads}
							onReexpand={onReexpand}
						/>
					);
				})}
			</InfiniteScroll>
		</Box>
	);
}

function useListHooks(chunkedScores: t_dbTweetScores[][]) {
	//InfiniteScrollリストページのindex
	const ref_listPageIndex = useRef<number>(1);
	//InfiniteScrollのinitialLoadをtrueにすると最初に同じページを2度読み込んでしまう不具合が起きる。なのでfalseにし、初期値で0ページ目をセットする。
	const [state_listScores, set_listScores] = useState<t_dbTweetScores[]>(chunkedScores[0]);
	//InfiniteScrollリストの次のページがあるかどうか
	const [state_hasMoreListScores, set_hasMoreListScores] = useState<boolean>(true);
	//InfiniteScrollの次のページを読み込む
	const onLoadNextPage = useCallback(() => {
		if (ref_listPageIndex.current >= chunkedScores.length) {
			set_hasMoreListScores(false);
			return;
		}
		set_listScores((e) => [...e, ...chunkedScores[ref_listPageIndex.current]]);
		ref_listPageIndex.current = ref_listPageIndex.current + 1;
	}, []);
	return {
		state_listScores,
		state_hasMoreListScores,
		onLoadNextPage,
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

function useBlockTweet(
	categoryName: string,
	tweets: t_dbTweetDataParsed[],
	authors: t_dbAuthor[],
	blockedAccounts: t_blockedAccount[],
	getAuthorData: (authorId: string) => t_dbAuthor,
) {
	//折り畳まれていたものを展開したツイート
	const [state_reexpandedTweets, set_reexpandedTweets] = useState<string[]>([]);
	const [state_blockedAccounts, set_blockedAccounts] = useState<t_blockedAccount[]>(blockedAccounts);
	//非表示を再展開
	const onReexpand = useCallback((tweetId: string) => {
		set_reexpandedTweets((e) => uniqForShortArray([...e, tweetId]));
	}, []);
	//指定投稿者のツイートのreexpandedをリセットする NG処理からのみ呼ばれる
	const resetReexpandedTheAuthorsTweets = (accountId: string) => {
		const authorsTweets = tweets.filter((e) => e.author_id === accountId);
		set_reexpandedTweets((reexTwIds) =>
			reexTwIds.filter((reexTwId) =>
				authorsTweets.find((authorsTweet) => authorsTweet.tweet_id === reexTwId) ? false : true,
			),
		);
	};
	//NGアカウントを追加。localstorage更新。
	const onBlock = useCallback((accountId: string) => {
		set_blockedAccounts((e) => {
			//これをしないと再展開したのをブロック解除→再ブロックしたときに展開されっぱなしになる（大した問題ではないが）
			resetReexpandedTheAuthorsTweets(accountId);
			//重複は除去
			const blockeds = Rb.uniqBy(Rb.prop('account_id'), [...e, getAuthorData(accountId)]);
			//保存
			saveBlockedAccounts(categoryName, blockeds);
			return blockeds;
		});
	}, []);
	//NGアカウントを解除。localstorage更新。
	const onUnblock = useCallback((accountId: string) => {
		set_blockedAccounts((e) => {
			const blockeds = e.filter((e) => e.account_id !== accountId);
			//保存
			saveBlockedAccounts(categoryName, blockeds);
			return blockeds;
		});
	}, []);

	return {
		state_reexpandedTweets,
		state_blockedAccounts,
		onReexpand,
		onBlock,
		onUnblock,
	};
}

function useTodaysReads(categoryName: string, readTweets: t_reads[], today: Date) {
	//今日のreads
	const ref_todaysReads = useRef<t_reads>(
		readTweets.find((e) => {
			const d = parseYyyy_mm_dd(e.yyyy_mm_dd);
			return differenceInCalendarDays(today, d) === 0;
		}) ?? { yyyy_mm_dd: intoYyyy_mm_dd(today), tweet_ids: [] },
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
	//渡された既読を保存。debounceで。
	const saveTodaysReadsDebounce = useDebouncedCallback(
		// function
		(reads: t_reads) => {
			addReadsToStorage(categoryName, {
				...reads,
				tweet_ids: uniqForShortArray(reads.tweet_ids),
			});
		},
		// delay in ms
		1000,
	);

	return {
		addTodayReads,
	};
}

function useGetTweetData(tweets: t_dbTweetDataParsed[], authors: t_dbAuthor[], readTweets: t_reads[]) {
	const getAuthorData = useCallback(
		(authorId: string) => authors.find((e) => e.account_id === authorId) ?? DUMMY_AUTHOR,
		[authors],
	);
	const getTweetData = useCallback(
		(tweetId: string) => tweets.find((e) => e.tweet_id === tweetId) ?? DUMMY_TWEET,
		[tweets],
	);
	//既読ツイートIDを取得
	const getReadTweetIds = (): string[] => {
		return Re.pipe(
			readTweets,
			Rb.map((e) => e.tweet_ids),
			flattenUniq,
		);
	};
	return {
		getAuthorData,
		getTweetData,
		getReadTweetIds,
	};
}
/**
 * ページを開いてすぐに既読を非表示にすると自動では次ページが読み込まれない
	既読を非表示にしてリストの高さが画面より小さくなるとそうなる模様
	なので次ページ読み込みボタンが必要である
 * @param props 
 * @returns 
 */
const LoadingComponent = (props: { onLoad: () => void }) => {
	return (
		<Button colorScheme='teal' onClick={props.onLoad} marginTop={4} marginBottom={4}>
			次のページ
		</Button>
	);
};

const createOriginalMainText = (text: string, urls: t_urls[]): string => {
	return urls
		.reduce((accumulator, currentValue) => {
			const reg = new RegExp(currentValue.url, 'g');
			return accumulator.replace(reg, currentValue.expanded_url);
		}, text)
		.replace(/(https:\/\/t\.co\/\w+)/g, '');
};
export const createNamesAndMainTextAndUrl = (
	authorData: t_dbAuthor,
	tweetData: t_dbTweetDataParsed,
	url: string,
	medias: (t_mediaPhoto | t_mediaVideo)[],
): string => {
	const mediaUrls = medias.map((e) => (e.type === 'photo' ? e.url : e.video_url)).join('\n');
	const mainText = createOriginalMainText(tweetData.text, tweetData.others.urls ?? []);
	return [`${authorData.name}@${authorData.screen_name}`, mainText, mediaUrls, url].join('\n');
};
function buildRankedTweetData(
	tweetScore: t_dbTweetScores,
	getTweetData: (tweetId: string) => t_dbTweetDataParsed,
	getAuthorData: (authorId: string) => t_dbAuthor,
	ngAccounts: t_blockedAccount[],
	readTweets: string[],
	reexpandedTweets: string[],
) {
	const tweetData = getTweetData(tweetScore.tweet_id);
	return {
		score: tweetScore.score,
		tweetData: tweetData,
		authorData: getAuthorData(tweetData.author_id),
		isNgAccount: isNgAccount(ngAccounts, tweetData.author_id),
		isRead: readTweets.includes(tweetData.tweet_id),
		isReexpanded: reexpandedTweets.includes(tweetData.tweet_id),
	};
}

const DUMMY_AUTHOR: t_dbAuthor = {
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
function isNgAccount(ngAccounts: t_blockedAccount[], authorId: string): boolean {
	return ngAccounts.find((e) => e.account_id === authorId) ? true : false;
}
